package com.backend.ecommerce.model;


import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String image_1;
    @Column(nullable = true)
    private String image_2;
    @Column(nullable = true)
    private String image_3;
    @Column(nullable = true)
    private String image_4;
    @Column(nullable = true)
    private String image_5;
    @Column(nullable = false)
    private Double price;
    @Column(nullable = false)
    private String description;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer quantity = 0;

    @Setter
    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer b_quantity = 0;


}
