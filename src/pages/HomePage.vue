<!-- src/views/HomePage.vue -->
<template>
  <div class="home-page">
    <!-- Hero Image -->
    <div class="hero-image-container">
      <img 
        class="hero-image" 
        src="/img/foto_portada_web_etsisi2.jpg?version=9e93ace0b62b47d889f44cc929dbb583" 
        alt="ETSISI - Escuela Técnica Superior de Ingeniería de Sistemas Informáticos"
      />
    </div>

    <!-- What are external practices card -->
    <div class="card card-outline-secondary mb-4">
      <div class="card-header text-start">
        <h3 class="mb-0">¿Qué es el Programa de Mentoría?</h3>
      </div>
      <div class="card-body text-start">
        <p>
          El Programa de Mentoría de la Escuela Técnica Superior de Ingeniería de Sistemas 
          Informáticos (ETSISI) de la UPM tiene como objetivo la orientación y ayuda a 
          estudiantes de nuevo ingreso (de primero y segundo curso, así como también 
          estudiantes internacionales) por parte de estudiantes de cursos superiores, bajo la 
          supervisión de los profesores coordinadores, tanto para conseguir el éxito en los 
          estudios universitarios, como para facilitar la integración académica y social en la vida 
          de la Escuela. 
        </p>
      </div>
    </div>

    <!-- Requirements card -->
    <div class="card card-outline-secondary mb-4">
      <div class="card-header text-start">
        <h3 class="mb-0">Requisitos</h3>
      </div>
      <div class="card-body text-start">
        <ol>
          <li>Ser estudiante de nuevo ingreso (primer o segundo curso) o ser de Erasmus para ser mentorizado. Puedes solicitarlo rellenando la Solicitud ser Mentorizado.</li>
          <li>
            Ser estudiante en los ultimos cursos (tercero o cuarto) para ser mentor. Puedes solicitarlo rellenando la Solicitud ser Mentor.
          </li>
        </ol>
      </div>
    </div>

    <!-- Want to know more card -->
    <div class="card card-outline-secondary mb-4">
      <div class="card-header text-start">
        <h3 class="mb-0">¿Quieres saber más?</h3>
      </div>
      <div class="list-group list-group-flush">
        <div class="list-group-item text-start">
          <h4>Contacto</h4>
          <address class="mb-0">
            Adjunta para Extensión Universitaria<br>
            Ana Belén Cristóbal López<br>
            Despacho: 8202<br>
            Email: <a href="mailto:conecta.etsisi@upm.es">conecta.etsisi@upm.es</a><br>
          </address>
        </div>
        <div class="list-group-item text-start">
          <h4>Preguntas frecuentes</h4>
          <p class="mb-0">Puedes revisar nuestro manual de preguntas frecuentes <a href="/faq">aquí</a>.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// No additional logic needed for static image
</script>

<style scoped>
.home-page {
  width: 100%;
}

/* Hero Image Container */
.hero-image-container {
  width: 100%;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  overflow: hidden;
  
}

.hero-image {
  width: 100%;
  height: auto; /* Altura automática */
  max-height: 250px; /* Altura máxima */
  object-fit: contain;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem;
}

.card-header h3 {
  color: #495057;
  font-weight: 600;
}

.card-body {
  padding: 1.5rem;
}

.list-group-item h4 {
  color: #495057;
  margin-bottom: 0.75rem;
}

.list-group-item address {
  font-style: normal;
  line-height: 1.6;
}

/* Forzar alineación a la izquierda para todo el contenido */
.text-start {
  text-align: left !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-image {
    height: 200px;
  }
  
  .card-body {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .home-page {
    padding: 0 0.5rem;
  }
  
  .hero-image {
    height: 150px;
  }
}
</style>