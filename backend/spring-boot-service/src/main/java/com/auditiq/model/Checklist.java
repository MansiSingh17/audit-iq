package com.auditiq.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.auditiq.model.Checklist.ChecklistItem;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "checklists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Checklist {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "document_id")
    private AuditDocument document;

    @Column(nullable = false)
    private String standardName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditDocument.ComplianceStandard standard;

    @Column(nullable = false)
    private Integer totalItems = 0;

    @Column(nullable = false)
    private Integer completedItems = 0;

    @Column(nullable = false)
    private String generatedBy = "AI System";

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<ChecklistItem> items = new ArrayList<>();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Inner class for ChecklistItem
    @Entity
    @Table(name = "checklist_items")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties({"checklist"})
    public static class ChecklistItem {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "checklist_id")
        private Checklist checklist;

        @Column(nullable = false)
        private Integer itemNumber;

        @Column(nullable = false, length = 1000)
        private String requirement;

        @Column(length = 2000)
        private String description;

        @Column(nullable = false)
        private Boolean completed = false;

        @Column(length = 2000)
        private String notes;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private Priority priority = Priority.MEDIUM;

        @Column(nullable = false)
        private LocalDateTime createdAt = LocalDateTime.now();

        public enum Priority {
            LOW, MEDIUM, HIGH, CRITICAL
        }
    }
}