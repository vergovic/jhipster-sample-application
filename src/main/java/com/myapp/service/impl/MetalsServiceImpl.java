package com.myapp.service.impl;

import com.myapp.domain.Metals;
import com.myapp.repository.MetalsRepository;
import com.myapp.service.MetalsService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Metals}.
 */
@Service
@Transactional
public class MetalsServiceImpl implements MetalsService {

    private final Logger log = LoggerFactory.getLogger(MetalsServiceImpl.class);

    private final MetalsRepository metalsRepository;

    public MetalsServiceImpl(MetalsRepository metalsRepository) {
        this.metalsRepository = metalsRepository;
    }

    @Override
    public Metals save(Metals metals) {
        log.debug("Request to save Metals : {}", metals);
        return metalsRepository.save(metals);
    }

    @Override
    public Metals update(Metals metals) {
        log.debug("Request to update Metals : {}", metals);
        return metalsRepository.save(metals);
    }

    @Override
    public Optional<Metals> partialUpdate(Metals metals) {
        log.debug("Request to partially update Metals : {}", metals);

        return metalsRepository
            .findById(metals.getId())
            .map(existingMetals -> {
                if (metals.getElementCode() != null) {
                    existingMetals.setElementCode(metals.getElementCode());
                }
                if (metals.getElementDescription() != null) {
                    existingMetals.setElementDescription(metals.getElementDescription());
                }

                return existingMetals;
            })
            .map(metalsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Metals> findAll() {
        log.debug("Request to get all Metals");
        return metalsRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Metals> findOne(Long id) {
        log.debug("Request to get Metals : {}", id);
        return metalsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Metals : {}", id);
        metalsRepository.deleteById(id);
    }
}
