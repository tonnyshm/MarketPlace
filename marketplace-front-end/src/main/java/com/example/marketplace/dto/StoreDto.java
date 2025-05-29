@Data
@NoArgsConstructor
public class StoreDto {
    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private String ownerName;
    private Integer productCount;

    public StoreDto(Store store) {
        this.id          = store.getId();
        this.name        = store.getName();
        this.description = store.getDescription();
        this.ownerId     = store.getOwner().getId();
        this.ownerName   = store.getOwner().getName();
        this.productCount = store.getProducts() != null ? store.getProducts().size() : 0;
    }

    public static StoreDto fromEntity(Store store) {
        return new StoreDto(store);
    }
} 