<template>
  <b-navbar
    toggleable="lg"
    type="light"
    variant="success"
    sticky="top"
    class="shadow-lg"
  >
    <b-navbar-brand to="/">
      <b-img
        src="../../assets/banino-logo.png"
        height="72"
        alt="Banino"
      ></b-img>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse">
      <font-awesome-icon icon="fa-solid fa-bars text-white" />
    </b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ms-auto me-5">
        <b-nav-item class="text-white" to="/public/about">About Us</b-nav-item>
        <b-nav-item class="text-white" to="/public/login">Log in</b-nav-item>
        <b-nav-item class="text-white" to="/public/register"
          >Register</b-nav-item
        >
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
