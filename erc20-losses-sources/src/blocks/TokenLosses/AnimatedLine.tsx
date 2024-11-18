import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";

export const AnimatedLine = ({ isLoading }: { isLoading?: boolean }) => {
  const { windowWidth } = useIsMobile();
  const pathRef = useRef<SVGPathElement>(null);

  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false); // Track if the animation has run

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true); // Start animation
          setHasAnimated(true); // Mark as animated
        }
      },
      { threshold: 0.1 }, // Trigger when 10% of the element is visible
    );

    if (pathRef.current) {
      observer.observe(pathRef.current);
    }

    return () => {
      if (pathRef.current) observer.unobserve(pathRef.current);
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (isInView && pathRef.current) {
      const length = pathRef.current.getTotalLength() + 40;

      // Set initial styles
      pathRef.current.style.strokeDasharray = `${length}`;
      pathRef.current.style.strokeDashoffset = `${length}`;

      const animation = pathRef.current.animate(
        [{ strokeDashoffset: `${length}` }, { strokeDashoffset: "0" }],
        {
          duration: 4500,
          easing: "linear",
          fill: "forwards",
        },
      );

      return () => animation.cancel();
    }
  }, [isInView]);
  // SVG props
  const svgProps = useMemo(() => {
    if (windowWidth >= 1536) {
      return isLoading
        ? {
            width: "1221",
            height: "996",
            viewBox: "0 0 1221 996",
            d: "M2.05293 0V0C2.05293 14.6163 13.9018 26.4651 28.5181 26.4651H1187C1204.67 26.4651 1219 40.792 1219 58.4651V918.705C1219 936.378 1204.67 950.705 1187 950.705H34C16.3269 950.705 2 965.032 2 982.705V996",
          }
        : {
            width: "1221",
            height: "952",
            viewBox: "0 0 1221 952",
            d: "M2.05293 0V0C2.05293 13.9706 13.3783 25.296 27.3489 25.296H1187C1204.67 25.296 1219 39.6229 1219 57.296V876.706C1219 894.379 1204.67 908.706 1187 908.706H34C16.3269 908.706 2 923.033 2 940.706V952",
          };
    } else if (windowWidth >= 1024) {
      return isLoading
        ? {
            width: "926",
            height: "1528",
            viewBox: "0 0 926 1528",
            d: "M2.04009 0V0C2.04009 14.3848 13.7013 26.046 28.0861 26.046H891.757C909.431 26.046 923.757 40.3729 923.757 58.046V1451.42C923.757 1469.1 909.43 1483.42 891.757 1483.42H34C16.3268 1483.42 2 1497.75 2 1515.42V1528",
          }
        : {
            width: "926",
            height: "1484",
            viewBox: "0 0 926 1484",
            d: "M2.04009 0V0C2.04009 13.9706 13.3655 25.296 27.3361 25.296H891.757C909.431 25.296 923.757 39.6229 923.757 57.296V1408.71C923.757 1426.38 909.43 1440.71 891.757 1440.71H34C16.3268 1440.71 2 1455.03 2 1472.71V1484",
          };
    }

    return isLoading
      ? {
          width: "318",
          height: "1330",
          viewBox: "0 0 318 1330",
          d: "M2.01375 0V1.4031C2.01375 8.03052 7.38634 13.4031 14.0138 13.4031H304C310.627 13.4031 316 18.7757 316 25.4031V1304.6C316 1311.22 310.627 1316.6 304 1316.6H14C7.37259 1316.6 2 1321.97 2 1328.6V1330",
        }
      : {
          width: "318",
          height: "1290",
          viewBox: "0 0 318 1290",
          d: "M2.01375 0V1C2.01375 7.62742 7.38634 13 14.0138 13H304C310.627 13 316 18.3726 316 25V1265C316 1271.63 310.627 1277 304 1277H14C7.37259 1277 2 1282.37 2 1289V1290",
        };
  }, [isLoading, windowWidth]);

  return (
    <svg
      className="line-animation"
      width={svgProps.width}
      height={svgProps.height}
      viewBox={svgProps.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={svgProps.d} stroke="#30363D" strokeWidth="4" />
      <path
        ref={pathRef}
        d={svgProps.d}
        stroke={hasAnimated ? "#82BDAB" : "#30363D"}
        strokeWidth="4"
      />
    </svg>
  );
};
