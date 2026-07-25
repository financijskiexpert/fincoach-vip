-- Starter Paket beležke (ločene od VSN notes tabele)
create table if not exists starter_notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  week_num    smallint not null check (week_num between 1 and 10),
  content     text not null default '',
  updated_at  timestamptz not null default now(),
  unique (user_id, week_num)
);

alter table starter_notes enable row level security;

create policy "Uporabnik vidi samo svoje starter beležke"
  on starter_notes for select
  using (auth.uid() = user_id);

create policy "Uporabnik ureja samo svoje starter beležke"
  on starter_notes for insert
  with check (auth.uid() = user_id);

create policy "Uporabnik posodablja samo svoje starter beležke"
  on starter_notes for update
  using (auth.uid() = user_id);
