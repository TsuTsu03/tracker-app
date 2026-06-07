-- WealthFlow — production schema
-- Run in Supabase SQL editor (or `supabase db push`).
-- Multi-tenant: every row is owned by an advisor (auth.users). RLS isolates data per user.

-- ─────────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null default 'Financial Advisor',
  role        text not null default 'Financial Advisor',
  unit        text not null default 'Apex Wealth Unit',
  branch      text not null default 'Makati Branch',
  avatar_seed text not null default 'Advisor',
  created_at  timestamptz not null default now()
);

create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  advisor_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  full_name         text not null,
  nickname          text,
  birthday          date,
  age               int,
  gender            text,
  phone             text not null default '',
  email             text not null default '',
  occupation        text not null default '',
  company           text,
  industry          text,
  civil_status      text,
  dependents        int,
  monthly_income    numeric,
  net_worth         numeric,
  location          text not null default '',
  socials           jsonb not null default '[]',
  stage             text not null default 'New Lead',
  temperature       text not null default 'Warm',
  ai_score          int  not null default 50,
  score_reasons     jsonb not null default '[]',
  potential_premium numeric not null default 0,
  last_contact      timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  source            text not null default 'Manual',
  avatar_seed       text
);

create table if not exists public.clients (
  id                 uuid primary key default gen_random_uuid(),
  advisor_id         uuid not null default auth.uid() references auth.users (id) on delete cascade,
  full_name          text not null,
  nickname           text,
  age                int not null default 0,
  phone              text not null default '',
  email              text not null default '',
  occupation         text not null default '',
  location           text not null default '',
  civil_status       text not null default '',
  dependents         int not null default 0,
  relationship_score int not null default 50,
  last_contact       timestamptz not null default now(),
  client_since       timestamptz not null default now(),
  policies           jsonb not null default '[]',
  beneficiaries      jsonb not null default '[]',
  goals              jsonb not null default '[]',
  notes              text not null default '',
  timeline           jsonb not null default '[]'
);

create table if not exists public.tasks (
  id         uuid primary key default gen_random_uuid(),
  advisor_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title      text not null,
  due        timestamptz not null default now(),
  type       text not null default 'Follow-up',
  related_to text not null default '',
  priority   text not null default 'Medium',
  done       boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id         uuid primary key default gen_random_uuid(),
  advisor_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client     text not null,
  request    text not null,
  status     text not null default 'Open',
  priority   text not null default 'Medium',
  created    timestamptz not null default now()
);

create table if not exists public.claims (
  id         uuid primary key default gen_random_uuid(),
  advisor_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client     text not null,
  policy     text not null,
  type       text not null,
  amount     numeric not null default 0,
  status     text not null default 'Submitted',
  filed      timestamptz not null default now()
);

create table if not exists public.team_members (
  id           uuid primary key default gen_random_uuid(),
  advisor_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name         text not null,
  role         text not null default 'Financial Advisor',
  unit         text not null default 'Apex Wealth',
  appointments int not null default 0,
  applications int not null default 0,
  production   numeric not null default 0,
  persistency  int not null default 0,
  conversion   int not null default 0,
  avatar_seed  text not null default 'Advisor'
);

create table if not exists public.production_trend (
  id         uuid primary key default gen_random_uuid(),
  advisor_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  month      text not null,
  ord        int  not null default 0,
  production numeric not null default 0,
  target     numeric not null default 0
);

create index if not exists leads_advisor_idx        on public.leads (advisor_id);
create index if not exists clients_advisor_idx      on public.clients (advisor_id);
create index if not exists tasks_advisor_idx        on public.tasks (advisor_id);
create index if not exists tickets_advisor_idx      on public.tickets (advisor_id);
create index if not exists claims_advisor_idx       on public.claims (advisor_id);
create index if not exists team_advisor_idx         on public.team_members (advisor_id);
create index if not exists trend_advisor_idx        on public.production_trend (advisor_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security — each advisor sees only their own rows
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles         enable row level security;
alter table public.leads            enable row level security;
alter table public.clients          enable row level security;
alter table public.tasks            enable row level security;
alter table public.tickets          enable row level security;
alter table public.claims           enable row level security;
alter table public.team_members     enable row level security;
alter table public.production_trend enable row level security;

-- profiles keyed on id; everything else on advisor_id
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['leads','clients','tasks','tickets','claims','team_members','production_trend']
  loop
    execute format('drop policy if exists "own rows" on public.%I;', t);
    execute format(
      'create policy "own rows" on public.%I for all using (advisor_id = auth.uid()) with check (advisor_id = auth.uid());',
      t
    );
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- New-user bootstrap: create profile + seed a realistic starter book
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.seed_starter_data(uid uuid, advisor_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Leads ----------------------------------------------------------------------
  insert into public.leads
    (advisor_id, full_name, nickname, age, gender, phone, email, occupation, company, industry,
     civil_status, dependents, monthly_income, net_worth, location, socials, stage, temperature,
     ai_score, score_reasons, potential_premium, last_contact, created_at, source, avatar_seed)
  values
    (uid,'Juan Carlos Santos','JC',38,'Male','0917 555 0142','jc.santos@gmail.com','Operations Director','MetroLogix Inc.','Logistics','Married',2,180000,8500000,'BGC, Taguig','[{"platform":"LinkedIn","handle":"jc-santos"}]','Discovery Meeting','Hot',92,'["Married breadwinner with 2 children","No existing life insurance","Recently promoted to Director","High disposable income (₱180k/mo)"]',96000,now()-interval '2 days',now()-interval '21 days','Referral — Ana Cruz','Juan Santos'),
    (uid,'Dr. Maria Reyes','Doc Maria',44,'Female','0918 222 7781','maria.reyes.md@gmail.com','Pediatrician','Reyes Pedia Clinic','Healthcare','Married',3,320000,22000000,'Quezon City','[{"platform":"Facebook","handle":"drmariareyes"}]','Proposal Presented','Hot',95,'["High-income professional (₱320k/mo)","Business owner with succession needs","3 dependents incl. college-bound child","Underinsured vs. net worth"]',180000,now()-interval '1 days',now()-interval '35 days','AI Lead Generator','Maria Reyes'),
    (uid,'Paolo Mendoza','Pao',29,'Male','0905 884 3320','paolo.mendoza@outlook.com','Software Engineer','Globe Telecom','Technology','Single',0,110000,1800000,'Mandaluyong','[]','Appointment Scheduled','Warm',71,'["Young professional, strong income growth","Single — focus on VUL / investment angle","Tech-savvy, responsive online"]',36000,now()-interval '4 days',now()-interval '12 days','Facebook Ad','Paolo Mendoza'),
    (uid,'Engr. Ramon dela Cruz','Mon',51,'Male','0920 117 9043','ramon.delacruz@yahoo.com','Civil Engineer / Contractor','RDC Builders','Construction','Married',4,250000,15000000,'Pasig','[]','Under Consideration','Hot',88,'["Business owner nearing retirement","4 dependents — estate planning need","No retirement plan in place"]',150000,now()-interval '9 days',now()-interval '48 days','Referral — Dr. Maria Reyes','Ramon Cruz'),
    (uid,'Bea Villanueva','Bea',33,'Female','0916 443 1209','bea.villanueva@gmail.com','Marketing Manager','Unilever PH','FMCG','Married',1,140000,3200000,'Alabang, Muntinlupa','[]','Follow-Up','Warm',78,'["New parent — protection trigger event","Dual-income household","Open to education planning"]',48000,now()-interval '15 days',now()-interval '40 days','Webinar Signup','Bea Villanueva'),
    (uid,'Kevin Tan','Kev',41,'Male','0927 660 5512','kevin.tan@gmail.com','Restaurant Owner','Tan''s Lutong Bahay','Food & Beverage','Married',2,200000,9000000,'San Juan','[]','Contacted','Warm',74,'["SME owner — keyman & business continuity need","Irregular cashflow, prefers flexible premium","2 school-age children"]',60000,now()-interval '6 days',now()-interval '10 days','AI Lead Generator','Kevin Tan'),
    (uid,'Grace Lim','Grace',27,'Female','0939 221 8890','grace.lim@gmail.com','Freelance Graphic Designer',null,'Creative','Single',0,70000,600000,'Cebu City','[]','Responded','Warm',64,'["Freelancer — no employer benefits","Health & income protection gap","Budget-conscious"]',24000,now()-interval '3 days',now()-interval '8 days','Instagram DM','Grace Lim'),
    (uid,'Atty. Francisco Gomez','Frank',47,'Male','0917 909 0021','frank.gomez@gomezlaw.ph','Lawyer / Partner','Gomez & Associates','Legal','Married',2,400000,30000000,'Ortigas, Pasig','[]','New Lead','Hot',90,'["Top-bracket income (₱400k/mo)","Estate & tax-efficient wealth transfer need","Partner equity — succession planning"]',240000,now(),now()-interval '1 days','Referral — Engr. Ramon dela Cruz','Francisco Gomez'),
    (uid,'Nadia Hassan','Nads',36,'Female','0908 554 7712','nadia.hassan@gmail.com','OFW — Nurse (Dubai)',null,'Healthcare','Married',3,160000,4500000,'Davao City (family)','[]','Closed Won','Hot',85,'["OFW remittance-funded premiums","Strong family protection motivation","Closed VUL ₱72k/yr"]',72000,now()-interval '5 days',now()-interval '60 days','Referral — Nadia''s sister','Nadia Hassan'),
    (uid,'Marco Ramos','Marco',31,'Male','0915 332 9087','marco.ramos@gmail.com','Sales Account Exec','Nestlé PH','FMCG','Single',0,65000,null,'Las Piñas','[]','Closed Lost','Cold',41,'["Already insured via employer (declined)","Low urgency, price-sensitive","Revisit in 6–12 months"]',18000,now()-interval '25 days',now()-interval '55 days','Cold outreach','Marco Ramos'),
    (uid,'Sofia Aquino','Sofie',39,'Female','0917 220 4411','sofia.aquino@gmail.com','HR Director','Ayala Land','Real Estate','Married',2,220000,11000000,'Makati','[]','New Lead','Warm',80,'["Decision-maker, benefits-aware","Corporate group plan opportunity too","Education fund need (2 kids)"]',84000,now(),now()-interval '2 days','LinkedIn','Sofia Aquino'),
    (uid,'Dennis Ong','Den',45,'Male','0918 771 2390','dennis.ong@gmail.com','Architect','Ong Design Studio','Architecture','Married',3,280000,18000000,'Quezon City','[]','Contacted','Hot',86,'["Self-employed professional, no SSS-only safety net","High net worth, underinsured","Retirement + estate angle"]',120000,now()-interval '7 days',now()-interval '14 days','AI Lead Generator','Dennis Ong');

  -- Clients (JSONB dates built from now() offsets — always correct) -------------
  insert into public.clients
    (advisor_id, full_name, nickname, age, phone, email, occupation, location, civil_status,
     dependents, relationship_score, last_contact, client_since, policies, beneficiaries, goals, notes, timeline)
  values
    (uid,'Nadia Hassan','Nads',36,'0908 554 7712','nadia.hassan@gmail.com','Nurse (OFW)','Davao City','Married',3,88,
      now()-interval '5 days', now()-interval '55 days',
      jsonb_build_array(jsonb_build_object('id','P-1001','product','WealthLink VUL','type','VUL','faceAmount',2000000,'premium',72000,'frequency','Annual','status','In Force','nextDue',(now()+interval '120 days')::text,'startDate',(now()-interval '50 days')::text)),
      '[{"name":"Omar Hassan","relation":"Spouse","share":50},{"name":"Layla Hassan","relation":"Child","share":25},{"name":"Sami Hassan","relation":"Child","share":25}]',
      '["Children''s education fund","Family protection while abroad"]',
      'Prefers Viber updates. Remittances arrive every 5th. Wants to add education plan for eldest next year.',
      jsonb_build_array(
        jsonb_build_object('date',(now()-interval '60 days')::text,'label','First meeting (video call)','type','meeting'),
        jsonb_build_object('date',(now()-interval '56 days')::text,'label','Application submitted','type','application'),
        jsonb_build_object('date',(now()-interval '50 days')::text,'label','Policy approved & issued','type','approval'),
        jsonb_build_object('date',(now()-interval '50 days')::text,'label','First premium paid ₱72,000','type','payment'),
        jsonb_build_object('date',(now()-interval '5 days')::text,'label','Quarterly check-in call','type','milestone'))),
    (uid,'Andrea Lopez','Andie',42,'0917 443 9981','andrea.lopez@gmail.com','Bank Manager','Makati','Married',2,54,
      now()-interval '190 days', now()-interval '900 days',
      jsonb_build_array(
        jsonb_build_object('id','P-1002','product','LifeSecure Term','type','Life','faceAmount',5000000,'premium',45000,'frequency','Annual','status','In Force','nextDue',(now()+interval '30 days')::text,'startDate',(now()-interval '880 days')::text),
        jsonb_build_object('id','P-1003','product','HealthShield Max','type','Health','faceAmount',1000000,'premium',28000,'frequency','Annual','status','Grace Period','nextDue',(now()-interval '8 days')::text,'startDate',(now()-interval '500 days')::text)),
      '[{"name":"Carlos Lopez","relation":"Spouse","share":60},{"name":"Mia Lopez","relation":"Child","share":40}]',
      '["Retirement at 60","Healthcare protection"]',
      'Busy executive. Health policy in grace period — needs urgent reminder. Annual review overdue.',
      jsonb_build_array(
        jsonb_build_object('date',(now()-interval '900 days')::text,'label','Became client','type','milestone'),
        jsonb_build_object('date',(now()-interval '880 days')::text,'label','LifeSecure Term issued','type','approval'),
        jsonb_build_object('date',(now()-interval '500 days')::text,'label','HealthShield Max added','type','approval'),
        jsonb_build_object('date',(now()-interval '200 days')::text,'label','Premium paid','type','payment'),
        jsonb_build_object('date',(now()-interval '190 days')::text,'label','Last contact (SMS)','type','milestone'))),
    (uid,'Robert & Liza Chua','The Chuas',49,'0919 220 1100','robert.chua@gmail.com','Business Owners (Hardware)','Binondo, Manila','Married',3,76,
      now()-interval '30 days', now()-interval '1200 days',
      jsonb_build_array(
        jsonb_build_object('id','P-1004','product','Estate Builder Whole Life','type','Life','faceAmount',10000000,'premium',220000,'frequency','Annual','status','In Force','nextDue',(now()+interval '60 days')::text,'startDate',(now()-interval '1180 days')::text),
        jsonb_build_object('id','P-1005','product','EduSave Plan','type','Education','faceAmount',3000000,'premium',90000,'frequency','Annual','status','In Force','nextDue',(now()+interval '200 days')::text,'startDate',(now()-interval '700 days')::text)),
      '[{"name":"Liza Chua","relation":"Spouse","share":50},{"name":"Bryan Chua","relation":"Child","share":25},{"name":"Chloe Chua","relation":"Child","share":25}]',
      '["Estate transfer to children","Business continuity"]',
      'VIP client. Strong referral source — referred 3 leads. Schedule annual review + ask for referrals.',
      jsonb_build_array(
        jsonb_build_object('date',(now()-interval '1200 days')::text,'label','Became client','type','milestone'),
        jsonb_build_object('date',(now()-interval '1180 days')::text,'label','Estate Builder issued','type','approval'),
        jsonb_build_object('date',(now()-interval '700 days')::text,'label','EduSave Plan added','type','approval'),
        jsonb_build_object('date',(now()-interval '120 days')::text,'label','Referral given (Engr. Cruz)','type','milestone'),
        jsonb_build_object('date',(now()-interval '30 days')::text,'label','Anniversary greeting + call','type','milestone'))),
    (uid,'Patricia Gonzales','Patty',34,'0917 882 4410','patty.gonzales@gmail.com','Dentist','Iloilo City','Single',0,92,
      now()-interval '12 days', now()-interval '300 days',
      jsonb_build_array(jsonb_build_object('id','P-1006','product','WealthLink VUL','type','VUL','faceAmount',3000000,'premium',120000,'frequency','Annual','status','In Force','nextDue',(now()+interval '90 days')::text,'startDate',(now()-interval '290 days')::text)),
      '[{"name":"Elena Gonzales","relation":"Mother","share":100}]',
      '["Wealth accumulation","Early retirement at 50"]',
      'Very engaged. Tracks fund performance monthly. Candidate for top-up and referral introductions.',
      jsonb_build_array(
        jsonb_build_object('date',(now()-interval '300 days')::text,'label','Became client','type','milestone'),
        jsonb_build_object('date',(now()-interval '290 days')::text,'label','WealthLink VUL issued','type','approval'),
        jsonb_build_object('date',(now()-interval '90 days')::text,'label','Fund top-up ₱50,000','type','payment'),
        jsonb_build_object('date',(now()-interval '12 days')::text,'label','Portfolio review call','type','meeting')));

  -- Tasks ----------------------------------------------------------------------
  insert into public.tasks (advisor_id, title, due, type, related_to, priority, done) values
    (uid,'Send proposal follow-up to Dr. Maria Reyes', now(),                 'Follow-up','Dr. Maria Reyes',       'High',  false),
    (uid,'Discovery meeting — JC Santos (2pm, BGC)',    now(),                 'Meeting',  'Juan Carlos Santos',    'High',  false),
    (uid,'URGENT: Andrea Lopez health policy in grace period', now()+interval '1 days','Payment','Andrea Lopez',   'High',  false),
    (uid,'Annual review overdue — Andrea Lopez (190 days)',    now()+interval '2 days','Review', 'Andrea Lopez',   'Medium',false),
    (uid,'Call Engr. Ramon dela Cruz re: retirement proposal', now()+interval '1 days','Call',  'Engr. Ramon dela Cruz','Medium',false),
    (uid,'Ask the Chuas for referrals (annual review)', now()+interval '3 days','Review',  'Robert & Liza Chua',   'Low',   false),
    (uid,'Welcome message to new lead Atty. Gomez',     now(),                 'Follow-up','Atty. Francisco Gomez', 'High',  true);

  -- Service tickets ------------------------------------------------------------
  insert into public.tickets (advisor_id, client, request, status, priority, created) values
    (uid,'Andrea Lopez',       'Claims assistance', 'In Progress','High',  now()-interval '3 days'),
    (uid,'Robert & Liza Chua', 'Beneficiary change','Open',       'Medium',now()-interval '1 days'),
    (uid,'Patricia Gonzales',  'Fund switch',       'Resolved',   'Low',   now()-interval '10 days'),
    (uid,'Nadia Hassan',       'Address update',    'Open',       'Low',   now()-interval '2 days'),
    (uid,'Patricia Gonzales',  'Policy review',     'In Progress','Medium',now()-interval '5 days');

  -- Claims ---------------------------------------------------------------------
  insert into public.claims (advisor_id, client, policy, type, amount, status, filed) values
    (uid,'Andrea Lopez',      'HealthShield Max','Hospitalization',        185000,'Processing',now()-interval '4 days'),
    (uid,'Robert & Liza Chua','Estate Builder',  'Critical Illness Rider', 500000,'Approved',  now()-interval '14 days'),
    (uid,'Patricia Gonzales', 'WealthLink VUL',  'Partial Withdrawal',      80000,'Released',  now()-interval '30 days');

  -- Team (agency) --------------------------------------------------------------
  insert into public.team_members (advisor_id, name, role, unit, appointments, applications, production, persistency, conversion, avatar_seed) values
    (uid, advisor_name, 'Financial Advisor','Apex Wealth',24,11,1280000,94,46,advisor_name),
    (uid,'Carla Domingo','Financial Advisor','Apex Wealth',31,14,1640000,91,45,'Carla Domingo'),
    (uid,'Miguel Torres','Financial Advisor','Apex Wealth',18, 6, 720000,88,33,'Miguel Torres'),
    (uid,'Jasmine Yu',   'Financial Advisor','Summit Group',27,13,1510000,96,48,'Jasmine Yu'),
    (uid,'Paolo Rivera', 'Financial Advisor','Summit Group',12, 3, 380000,82,25,'Paolo Rivera');

  -- Production trend (6 months) ------------------------------------------------
  insert into public.production_trend (advisor_id, month, ord, production, target) values
    (uid,'Jan',1, 640000,800000),
    (uid,'Feb',2, 820000,800000),
    (uid,'Mar',3, 910000,850000),
    (uid,'Apr',4, 760000,850000),
    (uid,'May',5,1180000,900000),
    (uid,'Jun',6,1280000,900000);
end $$;

-- Trigger: on new auth user, create the profile and seed their starter book.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
begin
  insert into public.profiles (id, name, avatar_seed)
  values (new.id, display_name, display_name)
  on conflict (id) do nothing;

  perform public.seed_starter_data(new.id, display_name);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
