// 1. Setup Clerk SDK
import Clerk from "@clerk/clerk-sdk-node";

// 2. Setup Supabase SDK
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// Step 2: Fetch Clerk users
async function getUsers() {
  const users = await clerk.users.getUserList();
  return users.map(u => ({
    clerk_id: u.id,
    email: u.emailAddresses[0].emailAddress,
    full_name: u.firstName + " " + u.lastName,
    created_at: u.createdAt
  }));
}

// Step 3: Insert into Supabase
async function importUsers() {
  const users = await getUsers();

  for (const user of users) {
    const { error } = await supabase
      .from('users')
      .insert([user])
      .select();
    if (error) console.error('Error inserting user:', error);
  }

  console.log('Import complete!');
}

// Run the script
importUsers();