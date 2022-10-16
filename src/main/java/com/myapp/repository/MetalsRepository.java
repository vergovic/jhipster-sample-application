package com.myapp.repository;

import com.myapp.domain.Metals;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Metals entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MetalsRepository extends JpaRepository<Metals, Long> {}
