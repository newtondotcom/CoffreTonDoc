export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
        en: {
            welcome: 'Welcome 👋',
            specify_names: 'Specify the name of the new folder. 📂',
            create_folder: 'Create Folder 📁',
            folder_name: 'Folder Name 📁',
            create_file: 'Create File 📄',
            specify_file_name: 'Specify the name and extension of the new file. 📄',
            file_name: 'File Name 📄',
            extension: 'Extension 📋',
            list_date: 'Date 📅',
            list_name: 'Name 📝',
            list_size: 'Size 📏',
            spotlight: 'Spotlight 🔍',
            my_files: 'My Files 📁',
            upload_create: 'Upload / Create ☁️',
            select: 'Select 👇',
            view: 'View 👁️',
            open: 'Open 🔓',
            rename: 'Rename 📛',
            delete: 'Delete 🗑️',
            replace: 'Replace 🔄',
            replace_confirmation: 'Choose a file to replace the current one. 🔄',
            new_file_inside: 'New File Inside 📄',
            new_folder_inside: 'New Folder Inside 📁',
            new_folder: 'New Folder 📁',
            new_file: 'New File 📄',
            enter_new_folder_name: 'Enter the name for the new folder. 📂',
            create: 'Create 🔧',
            enter_new_file_name: 'Enter the name for the new file. 📄',
            save_changes: 'Save Changes 💾',
            delete_file: 'Delete File 🗑️',
            delete_confirmation:
                'Are you sure you want to delete this file? This action cannot be undone. ⚠️',
            rename_file: 'Rename File 📛',
            new_name: 'New Name 📝',
            made_in: 'Made with ❤️',
            hosted_in: 'Hosted in France 🇫🇷',
            links_my_files: 'My Files 📁',
            links_my_account: 'My Account 👤',
            links_sign_out: 'Sign Out 🔑',
            breadcrumb_path: 'Path 🚶‍♂️',
            breadcrumb_home: 'Home 🏠',
            storage_quota: 'Storage Quota 📦',
            mfa_code: 'MFA Code 🔑',
            mfa_enrollment: 'MFA Enrollment 🔑',
            mfa_enrollment_description: 'Please enroll your device with the MFA service. 🔑',
            enter_mfa_code: 'Please enter the code from your authenticator app. 🔑',
            submit: 'Submit 🔑',
            cancel: 'Cancel 🚫',
            mfa_list: 'A list of your MFA enrolled codes.',
            unenroll_device: 'Unenroll the device',
            unenroll_confirmation: 'Do you really want to unenroll this device?',
            close: 'Close',
            hi: 'Hi',
            wrong_credentials: 'Wrong credentials ! ⚠️',
            wrong_totp: 'Wrong TOTP code ! ⌛',
            error: 'Error',
            all_fields: 'Please make sure all the fields are correctly completed !',
            allow_using: 'By using our service, you agree to our ',
            tos: 'Terms of Service',
            privacy: 'Privacy policy',
            login: 'Log in',
            logout: 'Log out',
            login_description: 'Log in into your account here !',
            connect_us: 'Connect with us',
            username: 'Username',
            email: 'Email',
            password: 'Password',
            password_confirmation: 'Password',
            twofa_code: '2FA code',
            twofa_enabled: '2FA enabled',
            register: 'Register',
            register_description: 'Create an account here !',
            data_collect: `We won't collect any of your data or send you promotional email,
      don't worry ! You can check, this is open source 😊`,
            no_account: "Don't have an account?",
            already_account: 'Already have an account ?',
            account_created: "Account created successfully, now let's set up 2FA !",
            success: 'Sucess,',
            missing_2fa_account: 'Missing 2FA code',
            twofa_already_enabled: '2FA is already enabled on your account !',
            no_files: "Looks like you don't have any files yet !",
            seed_phrase: 'Encryption phrase (save this carrefully !)',
            attention_seed:
                'This phrase will be used to encrypt your datas to guarantee its unviolability !',
            save_seed:
                'Do you want to crypt and store your phrase in your browser ? (a bit unsafe in case someone has access to your computer but still recommended to not have to type it at each operation)',
            save_duration: 'How much time ?',
            seed_duration: 'Duration',
            select_duration: 'Select a duration',
            seed_day: 'day',
            seed_year: 'year',
            end_configuration: 'Complete my account configuration',
            seed_copied: 'Your phrase has successfully been copied to your clipboard ',
            key_seed_saved: 'Your key has been saved in your browser',
            authenticated: 'Authentifcated',
            unauthenticated: 'Unauthenticated',
            topt_by_hand:
                "Can't scan this ? In your TOPT app, you can also use 'CoffreTonDoc' as the account name and enter the following key manually: ",
            too_large: 'File size too large',
            file_limit: 'File size should be less than 1.5GB (browser crypto limitation)',
            logged_in: 'Logged in as',
            login_success: 'Login successful',
            login_error: 'Error while logging in',
            logout_error: 'Error while logging out',
        },
        fr: {
            welcome: 'Bienvenue 👋',
        },
    },
}));
