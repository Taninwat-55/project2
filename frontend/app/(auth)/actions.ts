"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SignupSchema } from "@/lib/schemas";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect("/login?message=Could not authenticate user");
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient();

    // 1. Get the data from the form
    const data = Object.fromEntries(formData.entries());

    // 2. Validate with Zod
    const validatedFields = SignupSchema.safeParse(data);

    if (!validatedFields.success) {
        // If there is an error (like passwords don't match), send the user back with a message
        const errorMessage = validatedFields.error.issues[0].message;
        return { success: false, error: errorMessage };
    }

    const { email, password, fullName } = validatedFields.data;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/account/update-password`,
    });

    if (error) {
        return redirect("/forgot-password?message=Could not send reset password email");
    }

    redirect("/login?message=Check email to reset password");
}
