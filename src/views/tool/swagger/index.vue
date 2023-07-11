<template>
  <elFrame :src="swaggerApi" />
</template>
<script>
import elFrame from './components/iframe'
export default {
  name: 'Swagger',
  components: { elFrame },
  data() {
    return {
      swaggerApi: process.env.VUE_APP_BASE_API + '/swagger/'
      // '/redoc/#operation/monitor_service_list'
    }
  }
}
</script>
