// src/components/LockedFeature/LockedFeature.jsx

export default function LockedFeature({
  title,
  description,
  requiredPlan,
}) {
  return (
    <div style={{ padding: 20, border: "1px dashed gray" }}>
      <h3>🔒 {title}</h3>
      <p>{description}</p>
      <button>
        Upgrade to {requiredPlan}
      </button>
    </div>
  );
}
