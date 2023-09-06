import React, { useState, useEffect } from 'react';
import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';
import AppHeader from '../../../components/AppComponents/AppHeader';
import LogoutPopup from '../../../components/AppComponents/LogoutPopup';
import AppFooter from '../../../components/AppComponents/AppFooter';
import signoutHandler from '../../../components/helpers/signout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/BaseComponents/Button/Button';

const Accessibility: React.FC<{}> = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [isSignoutModal, setIsSignoutModal] = useState<boolean>(null);
    const [referrerURL, setReferrerURL] = useState<string>(null);

    useEffect(() => {
        const getReferrerURL = async () => {
            const { serverConfig: { sdkContentServerUrl } } = await getSdkConfig();
            setReferrerURL(sdkContentServerUrl);
        }
        getReferrerURL();
    }, []);

    const makeList = (listNumber: number, entries: number) => {
        const output = [];
        for (let i = 0; i < entries; i += 1) {
            output.push(<li key={`${listNumber}${i}`}>{t(`ACCESSIBILITY_LIST_${listNumber}_${i}`)}</li>)
        }
        return output;
    };

    return (
        <>
            <AppHeader handleSignout={() => setIsSignoutModal(false)} appname={t("CLAIM_CHILD_BENEFIT")} />
            <div className="govuk-width-container">
                <Button
                    variant='backlink'
                    onClick={() => navigate(-1)}
                    key='StartPageBacklink'
                    attributes={{ type: 'link' }}
                />
                <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
                    <div className="govuk-grid-row">
                        <div className='govuk-grid-column-two-thirds'>
                            <h1 className="govuk-heading-l">
                                {t("ACCESSIBILITY_HEADING_1")}
                            </h1>
                            <p className='govuk-heading-m'>
                                {t("ACCESSIBILITY_HEADING_2")}
                            </p>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_1")}</p>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_2")}</p>
                            <h1 className="govuk-heading-l">
                                {t("ACCESSIBILITY_HEADING_3")}
                            </h1>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_3")}</p>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_4")}</p>
                            <ul className="govuk-list govuk-list--bullet">
                                {makeList(1, 5)}
                            </ul>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_5")}</p>
                            <p className='govuk-body'>
                                <a href="https://mcmw.abilitynet.org.uk/">{t("ACCESSIBILITY_ANCHOR_1")}</a>
                                {t("ACCESSIBILITY_P_6")}
                            </p>
                            <h1 className="govuk-heading-l">
                                {t("ACCESSIBILITY_P_7")}
                            </h1>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_8")} <a href="https://www.w3.org/TR/WCAG21/">{t("ACCESSIBILITY_ANCHOR_2")}</a>.</p>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_9")}</p>
                            <ul className="govuk-list govuk-list--bullet">
                                {makeList(2, 27)}
                            </ul>
                            <h1 className="govuk-heading-l">
                                {t("ACCESSIBILITY_HEADING_4")}
                            </h1>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_10")} <a href="https://www.gov.uk/get-help-hmrc-extra-support">{t("ACCESSIBILITY_ANCHOR_3")}</a> {t("ACCESSIBILITY_P_11")}</p>
                            <h1 className="govuk-heading-l">
                                {t("ACCESSIBILITY_HEADING_5")}
                            </h1>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_12")} <a href={`${referrerURL}?service=$463&referrerUrl=$www.account-np.hmrc.gov.uk/child-benefit/make_a_claim`}>{t("ACCESSIBILITY_ANCHOR_4")}</a>.</p>
                            <h1 className="govuk-heading-l">
                                {t("ACCESSIBILITY_HEADING_6")}
                            </h1>
                            <p className='govuk-body'>
                                {t("ACCESSIBILITY_P_13")}
                                <a href="https://www.equalityadvisoryservice.com/">{t("ACCESSIBILITY_ANCHOR_5")}</a>
                                {t("ACCESSIBILITY_P_14")}
                                <a href="https://www.equalityni.org/Home">{t("ACCESSIBILITY_ANCHOR_6")}</a>
                                {t("ACCESSIBILITY_P_15")}
                            </p>
                            <h1 className="govuk-heading-l">
                                {t("ACCESSIBILITY_HEADING_7")}
                            </h1>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_16")}</p>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_17")}</p>
                            <p className='govuk-body'>
                                {t("ACCESSIBILITY_P_18")}
                                <a href="https://www.gov.uk/get-help-hmrc-extra-support">{t("ACCESSIBILITY_ANCHOR_7")}</a>
                            </p>
                            <h1 className="govuk-heading-l">
                                {t("ACCESSIBILITY_HEADING_8")}
                            </h1>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_19")}</p>
                            <p className='govuk-body'>
                                {t("ACCESSIBILITY_P_20")}
                                <a href="https://www.w3.org/TR/WCAG21/">{t("ACCESSIBILITY_ANCHOR_8")}</a>
                                {t("ACCESSIBILITY_P_21")}
                            </p>
                            <ol className="govuk-list govuk-list--number">
                                {makeList(3, 26)}
                            </ol>

                            <h1 className="govuk-heading-l">
                                {t("ACCESSIBILITY_HEADING_9")}
                            </h1>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_22")}</p>
                            <p className='govuk-body'>
                                {t("ACCESSIBILITY_P_23")}
                                <a href="https://www.digitalaccessibilitycentre.org/">{t("ACCESSIBILITY_ANCHOR_9")}</a>
                                {t("ACCESSIBILITY_P_24")}
                            </p>
                            <p className='govuk-body'>{t("ACCESSIBILITY_P_25")}</p>
                            <p className="govuk-body">
                                <a href="https://www.tax.service.gov.uk/contact/report-technical-problem?newTab=true&service=accessibility-statement&referrerUrl=https%3A%2F%2Fwww.tax.service.gov.uk%2Faccessibility-statement%2Fclaim-child-benefit%3FreferrerUrl%3Dhttps%253A%252F%252Fwww.tax.service.gov.uk%252Ffill-online%252Fclaim-child-benefit%252Frecently-claimed-child-benefit%253F_ga%253D2.37580512.170046323.1692877957-1346543562.1678892511" className="govuk-link" rel="noreferrer noopener" target="_blank">
                                    {t("ACCESSIBILITY_ANCHOR_10")}
                                </a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
            <LogoutPopup
                show={isSignoutModal}
                hideModal={() => setIsSignoutModal(false)}
                handleSignoutModal={signoutHandler}
                handleStaySignIn={() => setIsSignoutModal(true)}
            />
            <AppFooter />
        </>
    )
};

export default Accessibility;
