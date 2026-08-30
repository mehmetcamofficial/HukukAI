import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Activity, Case, CaseAnalysis, CaseInput, CaseUpdate, CaseWorkspace, Client, ClientInput, Dashboard, Document, DocumentInput, GetCasesParams, HealthStatus, Research, ResearchInput, TimelineEvent, TimelineEventInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Returns server health status
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Returns server health status
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDashboardUrl: () => string;
/**
 * @summary Returns workspace overview data
 */
export declare const getDashboard: (options?: Parameters<typeof customFetch>[1]) => Promise<Dashboard>;
export declare const getGetDashboardQueryKey: () => readonly ["/api/dashboard"];
export declare const getGetDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboard>>>;
export type GetDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Returns workspace overview data
 */
export declare function useGetDashboard<TData = Awaited<ReturnType<typeof getDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetActivityUrl: () => string;
/**
 * @summary Returns recent workspace activity
 */
export declare const getActivity: (options?: Parameters<typeof customFetch>[1]) => Promise<Activity[]>;
export declare const getGetActivityQueryKey: () => readonly ["/api/activity"];
export declare const getGetActivityQueryOptions: <TData = Awaited<ReturnType<typeof getActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getActivity>>>;
export type GetActivityQueryError = ErrorType<unknown>;
/**
 * @summary Returns recent workspace activity
 */
export declare function useGetActivity<TData = Awaited<ReturnType<typeof getActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetCasesUrl: (params?: GetCasesParams) => string;
/**
 * @summary Lists cases
 */
export declare const getCases: (params?: GetCasesParams, options?: Parameters<typeof customFetch>[1]) => Promise<Case[]>;
export declare const getGetCasesQueryKey: (params?: GetCasesParams) => readonly ["/api/cases", ...GetCasesParams[]];
export declare const getGetCasesQueryOptions: <TData = Awaited<ReturnType<typeof getCases>>, TError = ErrorType<unknown>>(params?: GetCasesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCases>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCases>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCasesQueryResult = NonNullable<Awaited<ReturnType<typeof getCases>>>;
export type GetCasesQueryError = ErrorType<unknown>;
/**
 * @summary Lists cases
 */
export declare function useGetCases<TData = Awaited<ReturnType<typeof getCases>>, TError = ErrorType<unknown>>(params?: GetCasesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCases>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCaseUrl: () => string;
/**
 * @summary Creates a case
 */
export declare const createCase: (caseInput: CaseInput, options?: Parameters<typeof customFetch>[1]) => Promise<Case>;
export declare const getCreateCaseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCase>>, TError, {
        data: BodyType<CaseInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCase>>, TError, {
    data: BodyType<CaseInput>;
}, TContext>;
export type CreateCaseMutationResult = NonNullable<Awaited<ReturnType<typeof createCase>>>;
export type CreateCaseMutationBody = BodyType<CaseInput>;
export type CreateCaseMutationError = ErrorType<unknown>;
/**
* @summary Creates a case
*/
export declare const useCreateCase: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCase>>, TError, {
        data: BodyType<CaseInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCase>>, TError, {
    data: BodyType<CaseInput>;
}, TContext>;
export declare const getGetCaseUrl: (caseId: string) => string;
/**
 * @summary Gets a case workspace
 */
export declare const getCase: (caseId: string, options?: Parameters<typeof customFetch>[1]) => Promise<CaseWorkspace>;
export declare const getGetCaseQueryKey: (caseId: string) => readonly [`/api/cases/${string}`];
export declare const getGetCaseQueryOptions: <TData = Awaited<ReturnType<typeof getCase>>, TError = ErrorType<void>>(caseId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCase>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCase>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCaseQueryResult = NonNullable<Awaited<ReturnType<typeof getCase>>>;
export type GetCaseQueryError = ErrorType<void>;
/**
 * @summary Gets a case workspace
 */
export declare function useGetCase<TData = Awaited<ReturnType<typeof getCase>>, TError = ErrorType<void>>(caseId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCase>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateCaseUrl: (caseId: string) => string;
/**
 * @summary Updates a case
 */
export declare const updateCase: (caseId: string, caseUpdate: CaseUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Case>;
export declare const getUpdateCaseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCase>>, TError, {
        caseId: string;
        data: BodyType<CaseUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCase>>, TError, {
    caseId: string;
    data: BodyType<CaseUpdate>;
}, TContext>;
export type UpdateCaseMutationResult = NonNullable<Awaited<ReturnType<typeof updateCase>>>;
export type UpdateCaseMutationBody = BodyType<CaseUpdate>;
export type UpdateCaseMutationError = ErrorType<unknown>;
/**
* @summary Updates a case
*/
export declare const useUpdateCase: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCase>>, TError, {
        caseId: string;
        data: BodyType<CaseUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCase>>, TError, {
    caseId: string;
    data: BodyType<CaseUpdate>;
}, TContext>;
export declare const getGetCaseDocumentsUrl: (caseId: string) => string;
/**
 * @summary Lists case documents
 */
export declare const getCaseDocuments: (caseId: string, options?: Parameters<typeof customFetch>[1]) => Promise<Document[]>;
export declare const getGetCaseDocumentsQueryKey: (caseId: string) => readonly [`/api/cases/${string}/documents`];
export declare const getGetCaseDocumentsQueryOptions: <TData = Awaited<ReturnType<typeof getCaseDocuments>>, TError = ErrorType<unknown>>(caseId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCaseDocuments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCaseDocuments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCaseDocumentsQueryResult = NonNullable<Awaited<ReturnType<typeof getCaseDocuments>>>;
export type GetCaseDocumentsQueryError = ErrorType<unknown>;
/**
 * @summary Lists case documents
 */
export declare function useGetCaseDocuments<TData = Awaited<ReturnType<typeof getCaseDocuments>>, TError = ErrorType<unknown>>(caseId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCaseDocuments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateDocumentUrl: (caseId: string) => string;
/**
 * @summary Adds a document record to a case
 */
export declare const createDocument: (caseId: string, documentInput: DocumentInput, options?: Parameters<typeof customFetch>[1]) => Promise<Document>;
export declare const getCreateDocumentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDocument>>, TError, {
        caseId: string;
        data: BodyType<DocumentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createDocument>>, TError, {
    caseId: string;
    data: BodyType<DocumentInput>;
}, TContext>;
export type CreateDocumentMutationResult = NonNullable<Awaited<ReturnType<typeof createDocument>>>;
export type CreateDocumentMutationBody = BodyType<DocumentInput>;
export type CreateDocumentMutationError = ErrorType<unknown>;
/**
* @summary Adds a document record to a case
*/
export declare const useCreateDocument: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDocument>>, TError, {
        caseId: string;
        data: BodyType<DocumentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createDocument>>, TError, {
    caseId: string;
    data: BodyType<DocumentInput>;
}, TContext>;
export declare const getGetClientsUrl: () => string;
/**
 * @summary Lists clients
 */
export declare const getClients: (options?: Parameters<typeof customFetch>[1]) => Promise<Client[]>;
export declare const getGetClientsQueryKey: () => readonly ["/api/clients"];
export declare const getGetClientsQueryOptions: <TData = Awaited<ReturnType<typeof getClients>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClients>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getClients>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetClientsQueryResult = NonNullable<Awaited<ReturnType<typeof getClients>>>;
export type GetClientsQueryError = ErrorType<unknown>;
/**
 * @summary Lists clients
 */
export declare function useGetClients<TData = Awaited<ReturnType<typeof getClients>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getClients>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateClientUrl: () => string;
/**
 * @summary Creates a client
 */
export declare const createClient: (clientInput: ClientInput, options?: Parameters<typeof customFetch>[1]) => Promise<Client>;
export declare const getCreateClientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createClient>>, TError, {
        data: BodyType<ClientInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createClient>>, TError, {
    data: BodyType<ClientInput>;
}, TContext>;
export type CreateClientMutationResult = NonNullable<Awaited<ReturnType<typeof createClient>>>;
export type CreateClientMutationBody = BodyType<ClientInput>;
export type CreateClientMutationError = ErrorType<unknown>;
/**
* @summary Creates a client
*/
export declare const useCreateClient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createClient>>, TError, {
        data: BodyType<ClientInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createClient>>, TError, {
    data: BodyType<ClientInput>;
}, TContext>;
export declare const getGetResearchUrl: () => string;
/**
 * @summary Lists recent legal research
 */
export declare const getResearch: (options?: Parameters<typeof customFetch>[1]) => Promise<Research[]>;
export declare const getGetResearchQueryKey: () => readonly ["/api/research"];
export declare const getGetResearchQueryOptions: <TData = Awaited<ReturnType<typeof getResearch>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getResearch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getResearch>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetResearchQueryResult = NonNullable<Awaited<ReturnType<typeof getResearch>>>;
export type GetResearchQueryError = ErrorType<unknown>;
/**
 * @summary Lists recent legal research
 */
export declare function useGetResearch<TData = Awaited<ReturnType<typeof getResearch>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getResearch>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateResearchUrl: () => string;
/**
 * @summary Runs a source-grounded research request
 */
export declare const createResearch: (researchInput: ResearchInput, options?: Parameters<typeof customFetch>[1]) => Promise<Research>;
export declare const getCreateResearchMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createResearch>>, TError, {
        data: BodyType<ResearchInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createResearch>>, TError, {
    data: BodyType<ResearchInput>;
}, TContext>;
export type CreateResearchMutationResult = NonNullable<Awaited<ReturnType<typeof createResearch>>>;
export type CreateResearchMutationBody = BodyType<ResearchInput>;
export type CreateResearchMutationError = ErrorType<unknown>;
/**
* @summary Runs a source-grounded research request
*/
export declare const useCreateResearch: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createResearch>>, TError, {
        data: BodyType<ResearchInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createResearch>>, TError, {
    data: BodyType<ResearchInput>;
}, TContext>;
export declare const getGetCaseAnalysisUrl: (caseId: string) => string;
/**
 * @summary Gets the latest reviewable case analysis
 */
export declare const getCaseAnalysis: (caseId: string, options?: Parameters<typeof customFetch>[1]) => Promise<CaseAnalysis>;
export declare const getGetCaseAnalysisQueryKey: (caseId: string) => readonly [`/api/cases/${string}/analysis`];
export declare const getGetCaseAnalysisQueryOptions: <TData = Awaited<ReturnType<typeof getCaseAnalysis>>, TError = ErrorType<unknown>>(caseId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCaseAnalysis>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCaseAnalysis>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCaseAnalysisQueryResult = NonNullable<Awaited<ReturnType<typeof getCaseAnalysis>>>;
export type GetCaseAnalysisQueryError = ErrorType<unknown>;
/**
 * @summary Gets the latest reviewable case analysis
 */
export declare function useGetCaseAnalysis<TData = Awaited<ReturnType<typeof getCaseAnalysis>>, TError = ErrorType<unknown>>(caseId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCaseAnalysis>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateCaseAnalysisUrl: (caseId: string) => string;
/**
 * @summary Generates a demo analysis for review
 */
export declare const createCaseAnalysis: (caseId: string, options?: Parameters<typeof customFetch>[1]) => Promise<CaseAnalysis>;
export declare const getCreateCaseAnalysisMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCaseAnalysis>>, TError, {
        caseId: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCaseAnalysis>>, TError, {
    caseId: string;
}, TContext>;
export type CreateCaseAnalysisMutationResult = NonNullable<Awaited<ReturnType<typeof createCaseAnalysis>>>;
export type CreateCaseAnalysisMutationError = ErrorType<unknown>;
/**
* @summary Generates a demo analysis for review
*/
export declare const useCreateCaseAnalysis: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCaseAnalysis>>, TError, {
        caseId: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCaseAnalysis>>, TError, {
    caseId: string;
}, TContext>;
export declare const getGetCaseTimelineUrl: (caseId: string) => string;
/**
 * @summary Lists case chronology events
 */
export declare const getCaseTimeline: (caseId: string, options?: Parameters<typeof customFetch>[1]) => Promise<TimelineEvent[]>;
export declare const getGetCaseTimelineQueryKey: (caseId: string) => readonly [`/api/cases/${string}/timeline`];
export declare const getGetCaseTimelineQueryOptions: <TData = Awaited<ReturnType<typeof getCaseTimeline>>, TError = ErrorType<unknown>>(caseId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCaseTimeline>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCaseTimeline>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCaseTimelineQueryResult = NonNullable<Awaited<ReturnType<typeof getCaseTimeline>>>;
export type GetCaseTimelineQueryError = ErrorType<unknown>;
/**
 * @summary Lists case chronology events
 */
export declare function useGetCaseTimeline<TData = Awaited<ReturnType<typeof getCaseTimeline>>, TError = ErrorType<unknown>>(caseId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCaseTimeline>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateTimelineEventUrl: (caseId: string) => string;
/**
 * @summary Adds a chronology event
 */
export declare const createTimelineEvent: (caseId: string, timelineEventInput: TimelineEventInput, options?: Parameters<typeof customFetch>[1]) => Promise<TimelineEvent>;
export declare const getCreateTimelineEventMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTimelineEvent>>, TError, {
        caseId: string;
        data: BodyType<TimelineEventInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTimelineEvent>>, TError, {
    caseId: string;
    data: BodyType<TimelineEventInput>;
}, TContext>;
export type CreateTimelineEventMutationResult = NonNullable<Awaited<ReturnType<typeof createTimelineEvent>>>;
export type CreateTimelineEventMutationBody = BodyType<TimelineEventInput>;
export type CreateTimelineEventMutationError = ErrorType<unknown>;
/**
* @summary Adds a chronology event
*/
export declare const useCreateTimelineEvent: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTimelineEvent>>, TError, {
        caseId: string;
        data: BodyType<TimelineEventInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTimelineEvent>>, TError, {
    caseId: string;
    data: BodyType<TimelineEventInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map