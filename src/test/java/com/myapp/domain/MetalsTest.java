package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MetalsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Metals.class);
        Metals metals1 = new Metals();
        metals1.setId(1L);
        Metals metals2 = new Metals();
        metals2.setId(metals1.getId());
        assertThat(metals1).isEqualTo(metals2);
        metals2.setId(2L);
        assertThat(metals1).isNotEqualTo(metals2);
        metals1.setId(null);
        assertThat(metals1).isNotEqualTo(metals2);
    }
}
