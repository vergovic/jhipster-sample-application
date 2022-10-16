package com.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Metals.
 */
@Entity
@Table(name = "metals")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Metals implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "element_code")
    private String elementCode;

    @Column(name = "element_description")
    private String elementDescription;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Metals id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getElementCode() {
        return this.elementCode;
    }

    public Metals elementCode(String elementCode) {
        this.setElementCode(elementCode);
        return this;
    }

    public void setElementCode(String elementCode) {
        this.elementCode = elementCode;
    }

    public String getElementDescription() {
        return this.elementDescription;
    }

    public Metals elementDescription(String elementDescription) {
        this.setElementDescription(elementDescription);
        return this;
    }

    public void setElementDescription(String elementDescription) {
        this.elementDescription = elementDescription;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Metals)) {
            return false;
        }
        return id != null && id.equals(((Metals) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Metals{" +
            "id=" + getId() +
            ", elementCode='" + getElementCode() + "'" +
            ", elementDescription='" + getElementDescription() + "'" +
            "}";
    }
}
