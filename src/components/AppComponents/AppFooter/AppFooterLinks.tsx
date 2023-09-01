import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface Props {
  links: Array<{ linkText: string, href: string, isNavLink: boolean }>;
}

const AppFooterLinks: React.FC<Props> = ({ links }) => {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="govuk-visually-hidden">Support links</h2>
      <ul className="govuk-footer__inline-list">
        {
          links.map(({ linkText, href, isNavLink }, i) => {
            return (
              <li className="govuk-footer__inline-list-item" key={i + 'link'}>
                {
                  isNavLink ? (
                    <NavLink className="govuk-footer__link" to={href}>
                      {t(linkText)}
                    </NavLink>
                  ) : (
                    <a className="govuk-footer__link" href={href}>
                      {t(linkText)}
                    </a>
                  )
                }
              </li>
            )
          })
        }
      </ul>
    </>
  );
}

export default AppFooterLinks;
