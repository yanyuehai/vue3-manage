<template>
  <my-header @changeSidebar="changeSidebar" ></my-header>
  <my-sidebar :sidebar="sidebar" ></my-sidebar>

  <div class="content-box">
    <router-link to="/dashboard"></router-link>
    <router-link to="/table"></router-link>
    <div class="content">
      <router-view>
      </router-view>
    </div>
  </div>
</template>
<script>
import MyHeader from "../components/header.vue";
import MySidebar from "../components/sidebar.vue";
import MyDashboard from "../views/dashboard.vue";

export default {
  name: "Home",
  data() {
    return {
      sidebar: false,
    };
  },

  methods: {
	changeSidebar(newSidebar) {
		this.sidebar = newSidebar
		// console.log(this.sidebar);
	}
  },

  components: {
    MyHeader,
    MySidebar,
    MyDashboard,
  },

};

</script>
