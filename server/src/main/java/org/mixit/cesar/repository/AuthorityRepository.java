package org.mixit.cesar.repository;

import org.mixit.cesar.model.member.SharedLink;
import org.mixit.cesar.model.security.Authority;
import org.mixit.cesar.model.security.Role;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.repository.CrudRepository;

/**
 * {@link SharedLink}
 */
public interface AuthorityRepository extends CrudRepository<Authority, Long> {
    @Cacheable("security")
    Authority findByName(Role name);
}
