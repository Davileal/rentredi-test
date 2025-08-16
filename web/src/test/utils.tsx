import { render } from "@testing-library/react";
import { SWRConfig } from "swr";

export function renderWithSWR(ui) {
  return render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {ui}
    </SWRConfig>
  );
}
