<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRoute, useRouter } from 'vue-router'
import backgroundImage from '@/images/home-background-DuuOsHM--1.jpg'

// Import your custom login form components
import LoginForm from '@/components/auth/LoginForm.vue'
import SendResetForm from '@/components/auth/SendResetForm.vue'
 
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const forgot = ref(false)
const resetting = ref(false)

// Watch for route changes to check if user is on reset password page
watch(
  () => route.path,
  async (newPath) => {
    resetting.value = newPath === '/reset-password'
  },
)

// Handle reset password verification
onMounted(async () => {
  if (route.path === '/reset-password') {
    resetting.value = true
    if (!route.query.key) {
      router.push('/')
      return
    }
    try {
      await authStore.verifyResetToken(route.query.key)
    } catch (error) {
      console.error('Invalid reset token')
      router.push('/')
    }
  }
})
</script>

<template>
  <div class="row">
    <img src="@/images/Nauticstar-Blue-Logo.jpg" alt="NauticStar Boats" style="width: 300px;" class="logo mb-3" />
  </div>
  <div class="row">
    <div
      class="lazy-background login-background p-5"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <div class="row">
        <div class="col-12 col-md-6 col-lg-3">
          <div class="card p-4 border-0 shadow-lg mb-3">
            <loader :loading="loading"></loader>
            <h1 class="fw-bold text-uppercase">Dealer Digital Asset Library</h1>
            <div class="separator"></div>
            <p>
              Engage your customers with high-quality branded content from NauticStar Boats. New users
              can request access, existing users can login below.
            </p>

            <!-- Login & Password Reset Forms -->
            <transition name="fade" mode="out-in">
              <LoginForm
                v-if="!resetting && !forgot"
                @submit="login"
                @forgot="forgot = true"
                @loading="(val) => (loading = val)"
              />
              <SendResetForm
                v-else-if="!resetting && forgot"
                @back="forgot = false"
                @loading="(val) => (loading = val)"
              />
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Callouts Section -->
    <div class="callouts">
      <div class="row mx-5 g-5">
        <div class="col-lg-4">
          <h4>Photography & Video</h4>
          <p>
            In-depth high- and low-resolution photography and video are provided for our full line
            of NauticStar Boats.
          </p>
        </div>
        <div class="col-lg-4">
          <h4>Logos, Ads, & Brand Guidelines</h4>
          <p>
            Additional marketing assets are also provided for use in advertising, promotional
            emails, boat show, and PR applications.
          </p>
          <p>
            NauticStar Boats' policy is to cooperate enthusiastically with the media and press.
            Direct inquiries to:
          </p>
        </div>
        <div class="col-lg-4">
          <h4>Sales Resources</h4>
          <p>
            Pricing, specification sheets, product information guides, and other helpful sales tools
            are available.
          </p>
          <p>
            <b>Ryan Fritinger</b> - Marketing Manager<br />
            <a href="mailto:ryan.fritinger@nauticstarboats.com"
              >ryan.fritinger@nauticstarboats.com</a
            >
          </p>
          <p>
            <b>Tyson Moran</b> - Marketing Director<br />
            <a href="mailto:tyson@bigthundermarine.com"
              >tyson@bigthundermarine.com</a
            >
          </p>
        </div>
      </div>
    </div>
    <div class="row mx-5">
      <div class="col">
        <p class="disclaimer">
          NauticStar Boats grants blanket permission to use any of the provided photography, logos,
          ads and other assets for "legitimate and favorable" benefit to the NauticStar Boats brand.
        </p>
      </div>
    </div>
  </div>
</template>
