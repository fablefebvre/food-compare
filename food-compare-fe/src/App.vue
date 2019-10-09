<template>
  <div id="app">
    <!-- the router outlet, where all matched components would ber viewed -->
    <b-card title="Food Compare" no-body>
      <b-card-header header-tag="nav">
        <b-nav pills>
          <b-nav-item :to="'/'" exact exact-active-class="active">Home</b-nav-item>
          <b-nav-item :to="'/categories'" exact exact-active-class="active">Categories Search</b-nav-item>
          <b-nav-item :to="'/barcode'" exact exact-active-class="active">Bar Code Search</b-nav-item>
        </b-nav>
      </b-card-header>
      <b-card-body class="text center">
        <router-view/>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  @import "styles/global.scss";
</style>