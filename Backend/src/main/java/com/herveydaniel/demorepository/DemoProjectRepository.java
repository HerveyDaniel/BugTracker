package com.herveydaniel.demorepository;

import com.herveydaniel.demomodel.DemoProject;
import org.springframework.data.jpa.repository.JpaRepository;


public interface DemoProjectRepository extends JpaRepository<DemoProject, Long> {

    DemoProject findByProjectId(Long id);

}
