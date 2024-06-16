<script setup lang="ts">
definePageMeta({
    layout: false,
})

const config = useRuntimeConfig();
const supabase = useSupabaseClient();

let email = ref('');
let password = ref('');
let success = ref < boolean | undefined > (undefined);
let loading = ref(false);
let redirect = "/invalidonpurpose";
if (window.location.hostname === 'localhost') {
    redirect = "http://localhost:3000";
}
const signInWithGithub = async () => {
    console.log('signing in with github');
    try {
        const {
            data,
            error
        } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: redirect,
            },
        });
        if (error) {
            console.error('Github Sign-In Error:', error);
            return;
        }
    } catch (error) {
        console.error('Github Sign-In Error:', error);
    }
};
</script>

<template>
<div class="flex items-center justify-center h-screen ">
    <Card class="mx-auto max-w-sm">
        <CardHeader>
            <CardTitle class="text-2xl">
                Connect with us
            </CardTitle>
            <CardDescription>
                Use one of the following methods to log in or register
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div class="grid gap-4">
                <!--
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                            <NuxtLink to="/auth/reset" class="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </NuxtLink>
                        </div>
                        <Input id="password" type="password" required v-model="password" />
                    </div>
                    <Button type="submit" class="w-full" @click="login">
                        <div v-if="loading" aria-label="Loading..." role="status"
                            class="align-middle justify-center flex">
                            <svg class="animate-spin w-6 h-6 fill-slate-800" viewBox="3 3 18 18">
                                <path class="opacity-20"
                                    d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z">
                                </path>
                                <path
                                    d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z">
                                </path>
                            </svg>
                        </div>
                        <div v-else>
                            Login
                        </div>
                    </Button>
                    -->
                <Button variant="outline" class="w-full" @click="signInWithGithub">
                    <svg class="w-10 h-10 pt-2 -mr-2" viewBox="0 0 40 40">
                        <title>GitHub</title>
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    Login with Github
                </Button>
            </div>
            <div class="mt-4 text-center text-sm">
                By signing in, you agree to our <NuxtLink class="text-gray-500 underline" to="https://yogocap.com/tos">Terms of Service</NuxtLink>
                and <NuxtLink to="https://yogocap.com/privacy" class="text-gray-500 underline">Privacy Policy</NuxtLink> <br />

                <span class="text-xs">
                    we won't collect any of your data or send you promotional email, don't worry ! You can check, this is open source 😊
                </span>
            </div>
            <!--
                <div class="mt-4 text-center text-sm">
                    Don't have an account?
                    <NuxtLink to="/auth/register" class="underline">
                        Sign up
                    </NuxtLink>
                </div>
                -->
        </CardContent>
    </Card>
</div>
</template>
