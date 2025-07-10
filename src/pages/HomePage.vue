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
      <div class="card-header">
        <h3 class="mb-0">¿Qué son las prácticas externas?</h3>
      </div>
      <div class="card-body">
        <p>
          Los planes de estudios conducentes a la obtención de las titulaciones de Grado impartidas en la ETS de
          Ingeniería de Sistemas Informáticos contemplan la posibilidad de adquirir formación mediante la realización de
          Prácticas Académicas Externas en virtud de lo dispuesto en el 
          <a href="http://www.boe.es/boe/dias/2014/07/30/pdfs/BOE-A-2014-8138.pdf" target="_blank">RD 592/2014</a>.
        </p>
        <ul>
          <li>
            Para que las prácticas puedan tener reconocimiento en créditos deben ser prácticas externas curriculares.
          </li>
          <li>
            La asignatura de Prácticas Externas tiene asignada una carga docente en intervalos de 3 ECTS hasta
            un máximo de 18 créditos, con una equivalencia de 1 crédito ECTS = 30 horas.
          </li>
          <li>
            La Oficina de Prácticas Externas es la unidad de la ETSISI encargada de la información y gestión de
            las mismas.
          </li>
        </ul>
      </div>
    </div>

    <!-- Requirements card -->
    <div class="card card-outline-secondary mb-4">
      <div class="card-header">
        <h3 class="mb-0">Requisitos</h3>
      </div>
      <div class="card-body">
        <ol>
          <li>Haber superado el 50% de los créditos de la titulación (120 créditos).</li>
          <li>
            Estar en posesión del Anexo al Convenio de Cooperación Educativa, o de Credencial de Becario, según
            proceda.
          </li>
          <li>Matricularse, con el número de créditos acordado, en la asignatura Prácticas Externas.</li>
        </ol>
      </div>
    </div>

    <!-- Want to know more card -->
    <div class="card card-outline-secondary mb-4">
      <div class="card-header">
        <h3 class="mb-0">¿Quieres saber más?</h3>
      </div>
      <div class="list-group list-group-flush">
        <div class="list-group-item">
          <h4>Contacto</h4>
          <address class="mb-0">
            Oficina de Prácticas Externas de la Escuela Técnica Superior de Ingeniería de Sistemas Informáticos<br>
            Persona de contacto: Juana Triviño García<br>
            Despacho: 6006<br>
            Teléfono: 91 336 78 56<br>
            Horario de atención: 10 a 14 h.<br>
            Email: <a href="mailto:practicas.externas@etsisi.upm.es">practicas.externas@etsisi.upm.es</a><br>
            Web: <a href="http://www.etsisi.upm.es/practicasexternas" target="_blank">www.etsisi.upm.es/practicasexternas</a>
          </address>
        </div>
        <div class="list-group-item">
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