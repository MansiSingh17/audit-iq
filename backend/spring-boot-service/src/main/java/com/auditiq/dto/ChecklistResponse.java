package com.auditiq.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistResponse {
    private boolean success;
    private String standard;
    private List<ChecklistItemDTO> items;
    private String error;

    public int getTotalItems() {
        return items != null ? items.size() : 0;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChecklistItemDTO {
        private Integer itemNumber;
        private String requirement;
        private String description;
        private String priority;
    }
}
