-- V6: product decision — remove the orphaned CMS content-editor tables (cms_courses/cms_exercises/
-- cms_exams/cms_curriculum: CmsController had a full CRUD API but zero frontend consumers, confirmed
-- by repo-wide search) and the ROLE_TEACHER role (real @PreAuthorize plumbing in CmsController/
-- ExamController, but no reachable feature/screen ever assigned to it). Reduces unmaintained surface
-- rather than carrying it as silent debt.

DROP TABLE IF EXISTS public.cms_exercises;
DROP TABLE IF EXISTS public.cms_exams;
DROP TABLE IF EXISTS public.cms_curriculum;
DROP TABLE IF EXISTS public.cms_courses;

-- Reassign any user still on ROLE_TEACHER to ROLE_FREE before the role disappears (safe no-op if
-- no such role/user exists — both subqueries just resolve to no matching rows).
UPDATE public.users u
SET role_id = (SELECT id FROM public.roles WHERE name = 'ROLE_FREE')
WHERE u.role_id = (SELECT id FROM public.roles WHERE name = 'ROLE_TEACHER');

DELETE FROM public.roles WHERE name = 'ROLE_TEACHER';

ALTER TABLE public.roles DROP CONSTRAINT roles_name_check;
ALTER TABLE public.roles ADD CONSTRAINT roles_name_check CHECK (((name)::text = ANY ((ARRAY['ROLE_FREE'::character varying, 'ROLE_PREMIUM'::character varying, 'ROLE_ADMIN'::character varying])::text[])));
