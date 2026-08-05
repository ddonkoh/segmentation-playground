/**
 * -----------------------------------------------------------------------------
 * ShipSafe Home — /
 * -----------------------------------------------------------------------------
 * Demo entrypoint: redirects the root URL to the public segmentation playground.
 *
 * -----------------------------------------------------------------------------
 */

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/playground");
}
