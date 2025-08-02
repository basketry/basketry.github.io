import { MarkGithubIcon } from "@primer/octicons-react";

export const Contribute: React.FC<{ repo: string }> = ({ repo }) => {
  const url = `https://github.com/basketry/${repo}`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "0.4em",
        marginBottom: "1em",
      }}
    >
      <div>Contribute:</div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          textDecoration: "none",
          backgroundColor: "var(--ifm-color-emphasis-100)",
          color: "var(--ifm-font-color-base)",
          padding: "0.2em 0.6em",
          borderRadius: "0.3em",
          fontSize: "0.9em",
          fontWeight: 500,
          transition: "background-color 0.2s ease-in-out",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor =
            "var(--ifm-color-emphasis-200)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            "var(--ifm-color-emphasis-100)")
        }
      >
        <MarkGithubIcon size={16} />
        <span style={{ marginLeft: "0.4em" }}>GitHub</span>
      </a>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <span>basketry/{repo}</span>
      </a>
    </div>
  );
};
