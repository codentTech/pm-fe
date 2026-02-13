// "use client";

// import { use } from "react";
// import Auth from "@/auth/auth.component";
// import AUTH from "@/common/constants/auth.constant";
// import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
// import ProjectWikiList from "@/components/projects/project-wiki/project-wiki-list.component";

// export default function ProjectWikiPage({ params }) {
//   const { id } = use(params);

//   return (
//     <Auth
//       component={<ProjectWikiList projectId={id} />}
//       type={AUTH.PRIVATE}
//       title={NAVBAR_TITLE.PROJECT_DETAIL}
//     />
//   );
// }
"use client";

import { use } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import ProjectWikiList from "@/components/projects/wiki/project-wiki-list.component";

export default function ProjectWikiListPage({ params }) {
  const { id } = use(params);
  return (
    <Auth
      component={<ProjectWikiList projectId={id} />}
      type={AUTH.PRIVATE}
      title={NAVBAR_TITLE.PROJECT_DETAIL}
    />
  );
}
