"use client";
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { supabase } from '../../lib/supabase';

export default function ConfirmPage() {
  const [message, setMessage] = useState("Confirming...");
  const router = useRouter();

  useEffect(() => {
    const confirmEmail = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setMessage("Error confirming email: " + error.message);
        return;
      }

      if (data.user?.email_confirmed_at) {
        setMessage("Email confirmed! Redirecting...");
        setTimeout(() => {
          router.push("/"); // Redirect to homepage or dashboard
        }, 2000);
      } else {
        setMessage("Email not confirmed. Please try again.");
      }
    };

    confirmEmail();
  }, [router]);

  return (
    <div className="p-4">
      <h2>{message}</h2>
    </div>
  );
}
