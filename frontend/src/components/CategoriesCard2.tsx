import "../styles/categorycard2.css";

type CardProps = {
  imageUrl?: string;
  title: string;
  description?: string | null;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

export default function CategoriesCard({
  imageUrl,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
}: CardProps) {
  return (
    <div
      className="ui-card ui-card--overlay"
      style={
        imageUrl
          ? ({ ["--card-bg" as any]: `url(${imageUrl})` } as React.CSSProperties)
          : undefined
      }
      role="button"
      tabIndex={0}
      onClick={onPrimaryAction}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onPrimaryAction?.();
      }}
      aria-label={`Otvori kategoriju: ${title}`}
    >
      {/* Background image layer */}
      <div className="ui-card__bg" aria-hidden="true" />

      {/* Bottom content */}
      <div className="ui-card__content">
        <div className="ui-card__text">
          <h3 className="ui-card__title">{title}</h3>
          <p className={`ui-card__desc ${!description ? "ui-card__desc--muted" : ""}`}>
            {description ? description : "Bez opisa"}
          </p>
        </div>

        {primaryActionLabel && (
          <button
            className="ui-card__cta"
            onClick={(e) => {
              e.stopPropagation(); // da klik na dugme ne okine 2x
              onPrimaryAction?.();
            }}
            aria-label={primaryActionLabel}
            type="button"
          >
            <span>{primaryActionLabel}</span>
            <span className="ui-card__cta-arrow">›</span>
          </button>
        )}
      </div>
    </div>
  );
}

