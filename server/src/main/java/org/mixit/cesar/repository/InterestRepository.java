package org.mixit.cesar.repository;

import org.mixit.cesar.model.member.Interest;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.repository.CrudRepository;

/**
 * {@link Interest}
 */
public interface InterestRepository extends CrudRepository<Interest, Long> {
    @Cacheable("session")
    Interest findByName(String name);
}
