package com.myapp.web.rest;

import com.myapp.domain.Metals;
import com.myapp.repository.MetalsRepository;
import com.myapp.service.MetalsService;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.Metals}.
 */
@RestController
@RequestMapping("/api")
public class MetalsResource {

    private final Logger log = LoggerFactory.getLogger(MetalsResource.class);

    private static final String ENTITY_NAME = "metals";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MetalsService metalsService;

    private final MetalsRepository metalsRepository;

    public MetalsResource(MetalsService metalsService, MetalsRepository metalsRepository) {
        this.metalsService = metalsService;
        this.metalsRepository = metalsRepository;
    }

    /**
     * {@code POST  /metals} : Create a new metals.
     *
     * @param metals the metals to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new metals, or with status {@code 400 (Bad Request)} if the metals has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/metals")
    public ResponseEntity<Metals> createMetals(@RequestBody Metals metals) throws URISyntaxException {
        log.debug("REST request to save Metals : {}", metals);
        if (metals.getId() != null) {
            throw new BadRequestAlertException("A new metals cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Metals result = metalsService.save(metals);
        return ResponseEntity
            .created(new URI("/api/metals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /metals/:id} : Updates an existing metals.
     *
     * @param id the id of the metals to save.
     * @param metals the metals to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated metals,
     * or with status {@code 400 (Bad Request)} if the metals is not valid,
     * or with status {@code 500 (Internal Server Error)} if the metals couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/metals/{id}")
    public ResponseEntity<Metals> updateMetals(@PathVariable(value = "id", required = false) final Long id, @RequestBody Metals metals)
        throws URISyntaxException {
        log.debug("REST request to update Metals : {}, {}", id, metals);
        if (metals.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, metals.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!metalsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Metals result = metalsService.update(metals);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, metals.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /metals/:id} : Partial updates given fields of an existing metals, field will ignore if it is null
     *
     * @param id the id of the metals to save.
     * @param metals the metals to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated metals,
     * or with status {@code 400 (Bad Request)} if the metals is not valid,
     * or with status {@code 404 (Not Found)} if the metals is not found,
     * or with status {@code 500 (Internal Server Error)} if the metals couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/metals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Metals> partialUpdateMetals(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Metals metals
    ) throws URISyntaxException {
        log.debug("REST request to partial update Metals partially : {}, {}", id, metals);
        if (metals.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, metals.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!metalsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Metals> result = metalsService.partialUpdate(metals);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, metals.getId().toString())
        );
    }

    /**
     * {@code GET  /metals} : get all the metals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of metals in body.
     */
    @GetMapping("/metals")
    public List<Metals> getAllMetals() {
        log.debug("REST request to get all Metals");
        return metalsService.findAll();
    }

    /**
     * {@code GET  /metals/:id} : get the "id" metals.
     *
     * @param id the id of the metals to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the metals, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/metals/{id}")
    public ResponseEntity<Metals> getMetals(@PathVariable Long id) {
        log.debug("REST request to get Metals : {}", id);
        Optional<Metals> metals = metalsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(metals);
    }

    /**
     * {@code DELETE  /metals/:id} : delete the "id" metals.
     *
     * @param id the id of the metals to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/metals/{id}")
    public ResponseEntity<Void> deleteMetals(@PathVariable Long id) {
        log.debug("REST request to delete Metals : {}", id);
        metalsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
