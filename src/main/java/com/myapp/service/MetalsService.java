package com.myapp.service;

import com.myapp.domain.Metals;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Metals}.
 */
public interface MetalsService {
    /**
     * Save a metals.
     *
     * @param metals the entity to save.
     * @return the persisted entity.
     */
    Metals save(Metals metals);

    /**
     * Updates a metals.
     *
     * @param metals the entity to update.
     * @return the persisted entity.
     */
    Metals update(Metals metals);

    /**
     * Partially updates a metals.
     *
     * @param metals the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Metals> partialUpdate(Metals metals);

    /**
     * Get all the metals.
     *
     * @return the list of entities.
     */
    List<Metals> findAll();

    /**
     * Get the "id" metals.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Metals> findOne(Long id);

    /**
     * Delete the "id" metals.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
