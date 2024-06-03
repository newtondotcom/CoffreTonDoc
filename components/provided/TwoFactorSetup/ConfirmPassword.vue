<template>
    <PopupWrapper name="confirm-password">
        <PopupHeader :title="$t('confirm_password')" icon="edit" />

        <PopupContent>
            <ValidationObserver @submit.prevent="confirmPassword" ref="passwordForm" v-slot="{ invalid }" tag="form">
                <ValidationProvider tag="div" mode="passive" name="Password" rules="required" v-slot="{ errors }">
                    <AppInputText :title="$t('password')" :error="errors[0]" :is-last="true">
                        <input
                            v-model="password"
                            :class="{ '!border-rose-600': errors[0] }"
                            type="password"
                            ref="input"
                            class="focus-border-theme input-dark"
                            :placeholder="$t('page_sign_in.placeholder_password')"
                        />
                    </AppInputText>
                </ValidationProvider>
            </ValidationObserver>
        </PopupContent>

        <PopupActions>
            <ButtonBase class="w-full" @click.native="$closePopup()" button-style="secondary">
                {{ $t('cancel') }}
            </ButtonBase>
            <ButtonBase
                class="w-full"
                @click.native="confirmPassword"
                button-style="theme"
                :loading="isLoading"
                :disabled="isLoading"
            >
                {{ $t('confirm') }}
            </ButtonBase>
        </PopupActions>
    </PopupWrapper>
</template>

<script>
//import {ValidationObserver, ValidationProvider} from 'vee-validate/dist/vee-validate.full'
import { Form, Field, ErrorMessage } from 'vee-validate';
import PopupWrapper from '@/components/provided/Popups/Components/PopupWrapper'
import PopupActions from '@/components/provided/Popups/Components/PopupActions'
import PopupContent from '@/components/provided/Popups/Components/PopupContent'
import PopupHeader from '@/components/provided/Popups/Components/PopupHeader'
import ButtonBase from '@/components/provided/UI/Buttons/ButtonBase'
import AppInputText from '@/components/provided/Forms/Layouts/AppInputText'
//import { required } from 'vee-validate/dist/rules'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
    name: 'ConfirmPassword',
    components: {
        ValidationProvider,
        ValidationObserver,
        AppInputText,
        PopupWrapper,
        PopupActions,
        PopupContent,
        PopupHeader,
        ButtonBase,
        required,
    },
    computed: {
        ...mapGetters(['user']),
    },
    data() {
        return {
            isLoading: false,
            password: undefined,
            args: undefined,
        }
    },
    methods: {
        confirmPassword() {
            this.isLoading = true

            axios
                .post('/user/confirm-password', {
                    password: this.password,
                })
                .then(() => {
                    events.$emit('password:confirmed', this.args)
                })
                .catch((error) => {
                    if (error.response.status === 422) {
                        this.$refs.passwordForm.setErrors({
                            Password: this.$t('validation_errors.incorrect_password'),
                        })
                    }
                })
                .finally(() => {
                    this.isLoading = false
                    this.password = undefined
                })
        },
    },
    created() {
        // Show popup
        events.$on('popup:open', (args) => {
            if (args.name !== 'confirm-password') return

            this.args = args
        })
    },
}
</script>
