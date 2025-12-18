create table memberships (
    membership_type text primary key,
    renewal_date date,
    paid_for boolean
);

create table users(
    user_id uuid primary key default gen_random_uuid(),
    username text not null,
    role text check (role in ('Owner', 'Coach', 'Player')),
    email text unique not null,
    password text,
    created_at timestamp with time zone default now(),
    membership_type text references memberships(membership_type)
);

create table location(
    location_id uuid primary key default gen_random_uuid(),
    phone_no text,
    address text,
    email_location text,
    time_open time,
    time_close time
);

create table simulator(
    room_id uuid primary key default gen_random_uuid(),
    room_name text,
    location_id uuid references location(location_id),
    available boolean
);

create table bookings(
    booking_id uuid primary key default gen_random_uuid(),
    user_id uuid references users(user_id),
    room_id uuid references simulator(room_id),
    start_time timestamp with time zone,
    duration interval,
    created_at timestamp with time zone default now(),
    paid_for boolean  
);

create table public.messages (
  message_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
  );