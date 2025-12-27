
import Button from "./Button";
import "../styles/categorycard.css";

type CardProps = {
  imageUrl?: string;
  title: string;
  description?: string | null;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

export default function Card({
  imageUrl,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: CardProps) {
  return (
    <div className="ui-card">
      <div className="ui-card__media">
        {imageUrl ? (
          <img className="ui-card__img" src={imageUrl} alt={title} />
        ) : (
          <div className="ui-card__img ui-card__img--placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="ui-card__body">
        <h3 className="ui-card__title">{title}</h3>

        <p className={`ui-card__desc ${!description ? "ui-card__desc--muted" : ""}`}>
          {description ? description : "Bez opisa"}
        </p>

        {(primaryActionLabel || secondaryActionLabel) && (
          <div className="ui-card__actions">
            {primaryActionLabel && (
              <Button variant="primary" onClick={onPrimaryAction}>
                {primaryActionLabel}
              </Button>
            )}

            {secondaryActionLabel && (
              <Button variant="secondary" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
