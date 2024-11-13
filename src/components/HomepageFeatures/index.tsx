import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

// Define the type for a feature item, making Svg optional
type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<"svg">>; // Svg is optional
  description?: JSX.Element; // description is optional
};

// Updated FeatureList to include your SVG logo
const FeatureList: FeatureItem[] = [
  {
    title: "", // No title
    Svg: require("@site/static/img/gunkustom.svg").default, // Path to your SVG logo
  },
];

// Feature component with centered styling for Svg and title
function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--12", styles.centerFeature)}>
      <div className="text--center">
        {Svg && <Svg className={styles.featureSvg} role="img" />}{" "}
        {/* Render the SVG */}
      </div>
      <div className="text--center padding-horiz--md">
        {title && <Heading as="h3">{title}</Heading>}{" "}
        {/* Only render title if it exists */}
        {description && <p>{description}</p>}{" "}
        {/* Only render description if it exists */}
      </div>
    </div>
  );
}

// Export the HomepageFeatures component
export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row justify-center align-center">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
