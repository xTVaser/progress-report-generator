<template>
  <v-app>
    <v-main>
      <ReportDashboard/>
    </v-main>
  </v-app>
</template>

<script>
import ReportDashboard from './components/ReportDashboard';

export default {
  name: 'App',

  components: {
    ReportDashboard,
  },

  data: () => ({
    //
  }),
};
</script>
