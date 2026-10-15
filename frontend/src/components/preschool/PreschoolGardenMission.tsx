import { useLearningSnapshot } from '../../hooks/useLearningSnapshot';
import { LearningSyncNotice } from '../LearningSyncNotice';
import React, { useEffect, useState } from 'react';
import type { PreschoolLanguage } from '../../data/preschool/types';
import { useCahierAccess } from '../../hooks/useCahierAccess';
import { getActiveProgressOwner } from '../../utils/progressOwner';
import { gardenStorageKey, readGardenResults, recordGardenResult } from '../../utils/gardenMissionProgress';
import type { TaskOutcome } from '../../utils/familyLearning';
import { GardenMission } from '../garden/GardenMission';
export function PreschoolGardenMission({ language, onExit }: {
    language: PreschoolLanguage;
    onExit: () => void;
}) {
    const { authUser, access, error, loading } = useCahierAccess();
    const account = authUser ? 'user:' + authUser.id : 'guest';
    const active = getActiveProgressOwner();
    const owner = active === account || active.startsWith(account + ':child:') ? active : account;
    return <Session key={owner + ':' + language} owner={owner} language={language} premium={Boolean(access?.premium)} unavailable={error} loading={loading} onExit={onExit}/>;
}
function Session({ owner, language, premium, unavailable, loading, onExit }: {
    owner: string;
    language: PreschoolLanguage;
    premium: boolean;
    unavailable: boolean;
    loading: boolean;
    onExit: () => void;
}) {
    const key = gardenStorageKey(owner, 'preschool', language);
    const snapshot = useLearningSnapshot(owner, 'garden-preschool-'+language, key, () => readGardenResults(key, 'preschool'));
 const {results}=snapshot;
 const setResults=(update:(previous:typeof results)=>typeof results)=>snapshot.save(update(results));
    const saveError=snapshot.storageError;
    const t = (fr: string, ar: string, en: string) => language === 'fr' ? fr : language === 'ar' ? ar : en;
    const record = (id: string, outcome: TaskOutcome) => setResults(previous => recordGardenResult(previous, id, outcome));
    return <div className="p-3 sm:p-6 bg-[#fffaf0] min-h-screen pb-24"><LearningSyncNotice language={language??undefined} status={snapshot.status} onRetry={snapshot.refresh}/>{loading && <p role="status">{t('Vérification de l’accès ; la découverte reste disponible.', 'نتحقق من الوصول؛ يبقى الاكتشاف متاحاً.', 'Checking access; discovery is still available.')}</p>}{unavailable && <p role="status">{t('Accès Premium indisponible pour le moment. La séance découverte reste accessible.', 'الوصول إلى Premium غير متاح حالياً. تبقى جلسة الاكتشاف متاحة.', 'Premium access is unavailable right now. The discovery session is still available.')}</p>}{saveError && <p role="alert">{t('Le résultat reste visible, mais cet appareil ne permet pas de le sauvegarder.', 'تظهر النتيجة لكن الجهاز لا يسمح بحفظها.', 'The result is visible but this device cannot save it.')}</p>}<GardenMission band="preschool" language={language} premium={premium} results={results} onResult={record} onExit={onExit}/></div>;
}
