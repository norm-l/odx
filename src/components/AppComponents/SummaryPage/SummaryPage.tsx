import React, {useEffect, useState} from 'react';
import  MainWrapper from '../../BaseComponents/MainWrapper' ;
import Button from '../../BaseComponents/Button/Button';
import ParsedHTML from '../../helpers/formatters/ParsedHtml';
import setPageTitle from '../../helpers/setPageTitleHelpers';

export default function SummaryPage(props){
    const {summaryTitle, summaryContent, summaryBanner, backlinkProps} = props; 
    const {backlinkAction, backlinkText} = backlinkProps;
    const [lang, setLang] = useState(sessionStorage.getItem('rsdk_locale')?.substring(0, 2));

    useEffect(()=> {
        PCore.getPubSubUtils().subscribe('languageToggleTriggered', ({language,localeRef})=>setLang(language), 'summaryPageLangChange');
        return () => {PCore.getPubSubUtils().unsubscribe('languageToggleTriggered', 'summaryPageLangChange');}
    }, []);
    
    useEffect(() => {
        setPageTitle();
    }, [summaryTitle, summaryBanner ])    
    
    return  <>
        {!summaryBanner && summaryContent && backlinkAction && <Button variant='backlink' onClick={backlinkAction}>{backlinkText}</Button> }
        <MainWrapper>
            <div>{lang}</div>
            { (summaryBanner && summaryBanner !== "") ?
                    <div className='govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-7'>
                        <h1 className='govuk-panel__title'> {summaryBanner} </h1>
                    </div> 
                    :
                    <h1 className='govuk-heading-l'>
                        {summaryTitle}
                    </h1>
            }
            <div><ParsedHTML htmlString={summaryContent} /></div>
        </MainWrapper>
    </>
}
