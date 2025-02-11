<script setup>
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  try {
    await authStore.logout();
    await router.push("/login"); // Redirect to login after logout
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>

<template>
  <a href="#" @click.prevent="logout">Logout</a>
</template>
