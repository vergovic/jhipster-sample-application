package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Metals;
import com.myapp.repository.MetalsRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MetalsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MetalsResourceIT {

    private static final String DEFAULT_ELEMENT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_ELEMENT_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_ELEMENT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_ELEMENT_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/metals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MetalsRepository metalsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMetalsMockMvc;

    private Metals metals;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Metals createEntity(EntityManager em) {
        Metals metals = new Metals().elementCode(DEFAULT_ELEMENT_CODE).elementDescription(DEFAULT_ELEMENT_DESCRIPTION);
        return metals;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Metals createUpdatedEntity(EntityManager em) {
        Metals metals = new Metals().elementCode(UPDATED_ELEMENT_CODE).elementDescription(UPDATED_ELEMENT_DESCRIPTION);
        return metals;
    }

    @BeforeEach
    public void initTest() {
        metals = createEntity(em);
    }

    @Test
    @Transactional
    void createMetals() throws Exception {
        int databaseSizeBeforeCreate = metalsRepository.findAll().size();
        // Create the Metals
        restMetalsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(metals)))
            .andExpect(status().isCreated());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeCreate + 1);
        Metals testMetals = metalsList.get(metalsList.size() - 1);
        assertThat(testMetals.getElementCode()).isEqualTo(DEFAULT_ELEMENT_CODE);
        assertThat(testMetals.getElementDescription()).isEqualTo(DEFAULT_ELEMENT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createMetalsWithExistingId() throws Exception {
        // Create the Metals with an existing ID
        metals.setId(1L);

        int databaseSizeBeforeCreate = metalsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMetalsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(metals)))
            .andExpect(status().isBadRequest());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMetals() throws Exception {
        // Initialize the database
        metalsRepository.saveAndFlush(metals);

        // Get all the metalsList
        restMetalsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(metals.getId().intValue())))
            .andExpect(jsonPath("$.[*].elementCode").value(hasItem(DEFAULT_ELEMENT_CODE)))
            .andExpect(jsonPath("$.[*].elementDescription").value(hasItem(DEFAULT_ELEMENT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getMetals() throws Exception {
        // Initialize the database
        metalsRepository.saveAndFlush(metals);

        // Get the metals
        restMetalsMockMvc
            .perform(get(ENTITY_API_URL_ID, metals.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(metals.getId().intValue()))
            .andExpect(jsonPath("$.elementCode").value(DEFAULT_ELEMENT_CODE))
            .andExpect(jsonPath("$.elementDescription").value(DEFAULT_ELEMENT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingMetals() throws Exception {
        // Get the metals
        restMetalsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMetals() throws Exception {
        // Initialize the database
        metalsRepository.saveAndFlush(metals);

        int databaseSizeBeforeUpdate = metalsRepository.findAll().size();

        // Update the metals
        Metals updatedMetals = metalsRepository.findById(metals.getId()).get();
        // Disconnect from session so that the updates on updatedMetals are not directly saved in db
        em.detach(updatedMetals);
        updatedMetals.elementCode(UPDATED_ELEMENT_CODE).elementDescription(UPDATED_ELEMENT_DESCRIPTION);

        restMetalsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMetals.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMetals))
            )
            .andExpect(status().isOk());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeUpdate);
        Metals testMetals = metalsList.get(metalsList.size() - 1);
        assertThat(testMetals.getElementCode()).isEqualTo(UPDATED_ELEMENT_CODE);
        assertThat(testMetals.getElementDescription()).isEqualTo(UPDATED_ELEMENT_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingMetals() throws Exception {
        int databaseSizeBeforeUpdate = metalsRepository.findAll().size();
        metals.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMetalsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, metals.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(metals))
            )
            .andExpect(status().isBadRequest());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMetals() throws Exception {
        int databaseSizeBeforeUpdate = metalsRepository.findAll().size();
        metals.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetalsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(metals))
            )
            .andExpect(status().isBadRequest());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMetals() throws Exception {
        int databaseSizeBeforeUpdate = metalsRepository.findAll().size();
        metals.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetalsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(metals)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMetalsWithPatch() throws Exception {
        // Initialize the database
        metalsRepository.saveAndFlush(metals);

        int databaseSizeBeforeUpdate = metalsRepository.findAll().size();

        // Update the metals using partial update
        Metals partialUpdatedMetals = new Metals();
        partialUpdatedMetals.setId(metals.getId());

        restMetalsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMetals.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMetals))
            )
            .andExpect(status().isOk());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeUpdate);
        Metals testMetals = metalsList.get(metalsList.size() - 1);
        assertThat(testMetals.getElementCode()).isEqualTo(DEFAULT_ELEMENT_CODE);
        assertThat(testMetals.getElementDescription()).isEqualTo(DEFAULT_ELEMENT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateMetalsWithPatch() throws Exception {
        // Initialize the database
        metalsRepository.saveAndFlush(metals);

        int databaseSizeBeforeUpdate = metalsRepository.findAll().size();

        // Update the metals using partial update
        Metals partialUpdatedMetals = new Metals();
        partialUpdatedMetals.setId(metals.getId());

        partialUpdatedMetals.elementCode(UPDATED_ELEMENT_CODE).elementDescription(UPDATED_ELEMENT_DESCRIPTION);

        restMetalsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMetals.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMetals))
            )
            .andExpect(status().isOk());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeUpdate);
        Metals testMetals = metalsList.get(metalsList.size() - 1);
        assertThat(testMetals.getElementCode()).isEqualTo(UPDATED_ELEMENT_CODE);
        assertThat(testMetals.getElementDescription()).isEqualTo(UPDATED_ELEMENT_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingMetals() throws Exception {
        int databaseSizeBeforeUpdate = metalsRepository.findAll().size();
        metals.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMetalsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, metals.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(metals))
            )
            .andExpect(status().isBadRequest());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMetals() throws Exception {
        int databaseSizeBeforeUpdate = metalsRepository.findAll().size();
        metals.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetalsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(metals))
            )
            .andExpect(status().isBadRequest());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMetals() throws Exception {
        int databaseSizeBeforeUpdate = metalsRepository.findAll().size();
        metals.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetalsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(metals)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Metals in the database
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMetals() throws Exception {
        // Initialize the database
        metalsRepository.saveAndFlush(metals);

        int databaseSizeBeforeDelete = metalsRepository.findAll().size();

        // Delete the metals
        restMetalsMockMvc
            .perform(delete(ENTITY_API_URL_ID, metals.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Metals> metalsList = metalsRepository.findAll();
        assertThat(metalsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
