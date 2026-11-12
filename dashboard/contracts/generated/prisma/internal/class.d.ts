import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Clinics
   * const clinics = await prisma.clinic.findMany()
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.PrismaClientConstructorArgs<Options>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Clinics
 * const clinics = await prisma.clinic.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = Prisma.PrismaClientOptions['omit'], in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.clinic`: Exposes CRUD operations for the **Clinic** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Clinics
  * const clinics = await prisma.clinic.findMany()
  * ```
  */
    get clinic(): Prisma.ClinicDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.petOwnerAccount`: Exposes CRUD operations for the **PetOwnerAccount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PetOwnerAccounts
      * const petOwnerAccounts = await prisma.petOwnerAccount.findMany()
      * ```
      */
    get petOwnerAccount(): Prisma.PetOwnerAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.petOwnerClinicLink`: Exposes CRUD operations for the **PetOwnerClinicLink** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PetOwnerClinicLinks
      * const petOwnerClinicLinks = await prisma.petOwnerClinicLink.findMany()
      * ```
      */
    get petOwnerClinicLink(): Prisma.PetOwnerClinicLinkDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.petOwnerSession`: Exposes CRUD operations for the **PetOwnerSession** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PetOwnerSessions
      * const petOwnerSessions = await prisma.petOwnerSession.findMany()
      * ```
      */
    get petOwnerSession(): Prisma.PetOwnerSessionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.petOwnerDevice`: Exposes CRUD operations for the **PetOwnerDevice** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PetOwnerDevices
      * const petOwnerDevices = await prisma.petOwnerDevice.findMany()
      * ```
      */
    get petOwnerDevice(): Prisma.PetOwnerDeviceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.petOwnerNotificationPreference`: Exposes CRUD operations for the **PetOwnerNotificationPreference** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PetOwnerNotificationPreferences
      * const petOwnerNotificationPreferences = await prisma.petOwnerNotificationPreference.findMany()
      * ```
      */
    get petOwnerNotificationPreference(): Prisma.PetOwnerNotificationPreferenceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.petOwnerRequest`: Exposes CRUD operations for the **PetOwnerRequest** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PetOwnerRequests
      * const petOwnerRequests = await prisma.petOwnerRequest.findMany()
      * ```
      */
    get petOwnerRequest(): Prisma.PetOwnerRequestDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.petOwnerNotificationRead`: Exposes CRUD operations for the **PetOwnerNotificationRead** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PetOwnerNotificationReads
      * const petOwnerNotificationReads = await prisma.petOwnerNotificationRead.findMany()
      * ```
      */
    get petOwnerNotificationRead(): Prisma.PetOwnerNotificationReadDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicSettings`: Exposes CRUD operations for the **ClinicSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicSettings
      * const clinicSettings = await prisma.clinicSettings.findMany()
      * ```
      */
    get clinicSettings(): Prisma.ClinicSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicSchedulingSettings`: Exposes CRUD operations for the **ClinicSchedulingSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicSchedulingSettings
      * const clinicSchedulingSettings = await prisma.clinicSchedulingSettings.findMany()
      * ```
      */
    get clinicSchedulingSettings(): Prisma.ClinicSchedulingSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicAgentSettings`: Exposes CRUD operations for the **ClinicAgentSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicAgentSettings
      * const clinicAgentSettings = await prisma.clinicAgentSettings.findMany()
      * ```
      */
    get clinicAgentSettings(): Prisma.ClinicAgentSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.agentConversation`: Exposes CRUD operations for the **AgentConversation** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AgentConversations
      * const agentConversations = await prisma.agentConversation.findMany()
      * ```
      */
    get agentConversation(): Prisma.AgentConversationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.agentMessage`: Exposes CRUD operations for the **AgentMessage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AgentMessages
      * const agentMessages = await prisma.agentMessage.findMany()
      * ```
      */
    get agentMessage(): Prisma.AgentMessageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicProtocols`: Exposes CRUD operations for the **ClinicProtocols** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicProtocols
      * const clinicProtocols = await prisma.clinicProtocols.findMany()
      * ```
      */
    get clinicProtocols(): Prisma.ClinicProtocolsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicNotificationSettings`: Exposes CRUD operations for the **ClinicNotificationSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicNotificationSettings
      * const clinicNotificationSettings = await prisma.clinicNotificationSettings.findMany()
      * ```
      */
    get clinicNotificationSettings(): Prisma.ClinicNotificationSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicOnboardingProfile`: Exposes CRUD operations for the **ClinicOnboardingProfile** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicOnboardingProfiles
      * const clinicOnboardingProfiles = await prisma.clinicOnboardingProfile.findMany()
      * ```
      */
    get clinicOnboardingProfile(): Prisma.ClinicOnboardingProfileDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicUser`: Exposes CRUD operations for the **ClinicUser** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicUsers
      * const clinicUsers = await prisma.clinicUser.findMany()
      * ```
      */
    get clinicUser(): Prisma.ClinicUserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.invite`: Exposes CRUD operations for the **Invite** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Invites
      * const invites = await prisma.invite.findMany()
      * ```
      */
    get invite(): Prisma.InviteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.task`: Exposes CRUD operations for the **Task** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Tasks
      * const tasks = await prisma.task.findMany()
      * ```
      */
    get task(): Prisma.TaskDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.subTask`: Exposes CRUD operations for the **SubTask** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SubTasks
      * const subTasks = await prisma.subTask.findMany()
      * ```
      */
    get subTask(): Prisma.SubTaskDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.taskActivity`: Exposes CRUD operations for the **TaskActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TaskActivities
      * const taskActivities = await prisma.taskActivity.findMany()
      * ```
      */
    get taskActivity(): Prisma.TaskActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.taskActivityMention`: Exposes CRUD operations for the **TaskActivityMention** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TaskActivityMentions
      * const taskActivityMentions = await prisma.taskActivityMention.findMany()
      * ```
      */
    get taskActivityMention(): Prisma.TaskActivityMentionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inboxItem`: Exposes CRUD operations for the **InboxItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InboxItems
      * const inboxItems = await prisma.inboxItem.findMany()
      * ```
      */
    get inboxItem(): Prisma.InboxItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inboxItemRead`: Exposes CRUD operations for the **InboxItemRead** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InboxItemReads
      * const inboxItemReads = await prisma.inboxItemRead.findMany()
      * ```
      */
    get inboxItemRead(): Prisma.InboxItemReadDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inboxActivity`: Exposes CRUD operations for the **InboxActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InboxActivities
      * const inboxActivities = await prisma.inboxActivity.findMany()
      * ```
      */
    get inboxActivity(): Prisma.InboxActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.userInboxSettings`: Exposes CRUD operations for the **UserInboxSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more UserInboxSettings
      * const userInboxSettings = await prisma.userInboxSettings.findMany()
      * ```
      */
    get userInboxSettings(): Prisma.UserInboxSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.service`: Exposes CRUD operations for the **Service** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Services
      * const services = await prisma.service.findMany()
      * ```
      */
    get service(): Prisma.ServiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicServiceConfig`: Exposes CRUD operations for the **ClinicServiceConfig** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicServiceConfigs
      * const clinicServiceConfigs = await prisma.clinicServiceConfig.findMany()
      * ```
      */
    get clinicServiceConfig(): Prisma.ClinicServiceConfigDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.serviceUsage`: Exposes CRUD operations for the **ServiceUsage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ServiceUsages
      * const serviceUsages = await prisma.serviceUsage.findMany()
      * ```
      */
    get serviceUsage(): Prisma.ServiceUsageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.sopTemplate`: Exposes CRUD operations for the **SopTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SopTemplates
      * const sopTemplates = await prisma.sopTemplate.findMany()
      * ```
      */
    get sopTemplate(): Prisma.SopTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.sopSection`: Exposes CRUD operations for the **SopSection** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SopSections
      * const sopSections = await prisma.sopSection.findMany()
      * ```
      */
    get sopSection(): Prisma.SopSectionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.sopStep`: Exposes CRUD operations for the **SopStep** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SopSteps
      * const sopSteps = await prisma.sopStep.findMany()
      * ```
      */
    get sopStep(): Prisma.SopStepDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.sopRun`: Exposes CRUD operations for the **SopRun** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SopRuns
      * const sopRuns = await prisma.sopRun.findMany()
      * ```
      */
    get sopRun(): Prisma.SopRunDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.sopRunStep`: Exposes CRUD operations for the **SopRunStep** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SopRunSteps
      * const sopRunSteps = await prisma.sopRunStep.findMany()
      * ```
      */
    get sopRunStep(): Prisma.SopRunStepDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labTestParameter`: Exposes CRUD operations for the **LabTestParameter** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabTestParameters
      * const labTestParameters = await prisma.labTestParameter.findMany()
      * ```
      */
    get labTestParameter(): Prisma.LabTestParameterDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labTestOrder`: Exposes CRUD operations for the **LabTestOrder** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabTestOrders
      * const labTestOrders = await prisma.labTestOrder.findMany()
      * ```
      */
    get labTestOrder(): Prisma.LabTestOrderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labTestOrderItem`: Exposes CRUD operations for the **LabTestOrderItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabTestOrderItems
      * const labTestOrderItems = await prisma.labTestOrderItem.findMany()
      * ```
      */
    get labTestOrderItem(): Prisma.LabTestOrderItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labTestActivity`: Exposes CRUD operations for the **LabTestActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabTestActivities
      * const labTestActivities = await prisma.labTestActivity.findMany()
      * ```
      */
    get labTestActivity(): Prisma.LabTestActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labTestComment`: Exposes CRUD operations for the **LabTestComment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabTestComments
      * const labTestComments = await prisma.labTestComment.findMany()
      * ```
      */
    get labTestComment(): Prisma.LabTestCommentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labTestCommentMention`: Exposes CRUD operations for the **LabTestCommentMention** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabTestCommentMentions
      * const labTestCommentMentions = await prisma.labTestCommentMention.findMany()
      * ```
      */
    get labTestCommentMention(): Prisma.LabTestCommentMentionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labPreAnalytical`: Exposes CRUD operations for the **LabPreAnalytical** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabPreAnalyticals
      * const labPreAnalyticals = await prisma.labPreAnalytical.findMany()
      * ```
      */
    get labPreAnalytical(): Prisma.LabPreAnalyticalDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labSampleCollection`: Exposes CRUD operations for the **LabSampleCollection** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabSampleCollections
      * const labSampleCollections = await prisma.labSampleCollection.findMany()
      * ```
      */
    get labSampleCollection(): Prisma.LabSampleCollectionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labTestReportMention`: Exposes CRUD operations for the **LabTestReportMention** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabTestReportMentions
      * const labTestReportMentions = await prisma.labTestReportMention.findMany()
      * ```
      */
    get labTestReportMention(): Prisma.LabTestReportMentionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.labTestResult`: Exposes CRUD operations for the **LabTestResult** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LabTestResults
      * const labTestResults = await prisma.labTestResult.findMany()
      * ```
      */
    get labTestResult(): Prisma.LabTestResultDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyExamDefinition`: Exposes CRUD operations for the **RadiologyExamDefinition** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyExamDefinitions
      * const radiologyExamDefinitions = await prisma.radiologyExamDefinition.findMany()
      * ```
      */
    get radiologyExamDefinition(): Prisma.RadiologyExamDefinitionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyOrder`: Exposes CRUD operations for the **RadiologyOrder** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyOrders
      * const radiologyOrders = await prisma.radiologyOrder.findMany()
      * ```
      */
    get radiologyOrder(): Prisma.RadiologyOrderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyOrderItem`: Exposes CRUD operations for the **RadiologyOrderItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyOrderItems
      * const radiologyOrderItems = await prisma.radiologyOrderItem.findMany()
      * ```
      */
    get radiologyOrderItem(): Prisma.RadiologyOrderItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologySafetyScreening`: Exposes CRUD operations for the **RadiologySafetyScreening** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologySafetyScreenings
      * const radiologySafetyScreenings = await prisma.radiologySafetyScreening.findMany()
      * ```
      */
    get radiologySafetyScreening(): Prisma.RadiologySafetyScreeningDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyExamExecution`: Exposes CRUD operations for the **RadiologyExamExecution** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyExamExecutions
      * const radiologyExamExecutions = await prisma.radiologyExamExecution.findMany()
      * ```
      */
    get radiologyExamExecution(): Prisma.RadiologyExamExecutionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyStudy`: Exposes CRUD operations for the **RadiologyStudy** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyStudies
      * const radiologyStudies = await prisma.radiologyStudy.findMany()
      * ```
      */
    get radiologyStudy(): Prisma.RadiologyStudyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologySeries`: Exposes CRUD operations for the **RadiologySeries** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologySeries
      * const radiologySeries = await prisma.radiologySeries.findMany()
      * ```
      */
    get radiologySeries(): Prisma.RadiologySeriesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyInstance`: Exposes CRUD operations for the **RadiologyInstance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyInstances
      * const radiologyInstances = await prisma.radiologyInstance.findMany()
      * ```
      */
    get radiologyInstance(): Prisma.RadiologyInstanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyReport`: Exposes CRUD operations for the **RadiologyReport** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyReports
      * const radiologyReports = await prisma.radiologyReport.findMany()
      * ```
      */
    get radiologyReport(): Prisma.RadiologyReportDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyReportAddendum`: Exposes CRUD operations for the **RadiologyReportAddendum** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyReportAddenda
      * const radiologyReportAddenda = await prisma.radiologyReportAddendum.findMany()
      * ```
      */
    get radiologyReportAddendum(): Prisma.RadiologyReportAddendumDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyAddendumMention`: Exposes CRUD operations for the **RadiologyAddendumMention** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyAddendumMentions
      * const radiologyAddendumMentions = await prisma.radiologyAddendumMention.findMany()
      * ```
      */
    get radiologyAddendumMention(): Prisma.RadiologyAddendumMentionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyAddendumAttachment`: Exposes CRUD operations for the **RadiologyAddendumAttachment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyAddendumAttachments
      * const radiologyAddendumAttachments = await prisma.radiologyAddendumAttachment.findMany()
      * ```
      */
    get radiologyAddendumAttachment(): Prisma.RadiologyAddendumAttachmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyComment`: Exposes CRUD operations for the **RadiologyComment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyComments
      * const radiologyComments = await prisma.radiologyComment.findMany()
      * ```
      */
    get radiologyComment(): Prisma.RadiologyCommentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyCommentMention`: Exposes CRUD operations for the **RadiologyCommentMention** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyCommentMentions
      * const radiologyCommentMentions = await prisma.radiologyCommentMention.findMany()
      * ```
      */
    get radiologyCommentMention(): Prisma.RadiologyCommentMentionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyReportTemplate`: Exposes CRUD operations for the **RadiologyReportTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyReportTemplates
      * const radiologyReportTemplates = await prisma.radiologyReportTemplate.findMany()
      * ```
      */
    get radiologyReportTemplate(): Prisma.RadiologyReportTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.radiologyActivity`: Exposes CRUD operations for the **RadiologyActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RadiologyActivities
      * const radiologyActivities = await prisma.radiologyActivity.findMany()
      * ```
      */
    get radiologyActivity(): Prisma.RadiologyActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationProcedureDefinition`: Exposes CRUD operations for the **OperationProcedureDefinition** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationProcedureDefinitions
      * const operationProcedureDefinitions = await prisma.operationProcedureDefinition.findMany()
      * ```
      */
    get operationProcedureDefinition(): Prisma.OperationProcedureDefinitionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationKitItem`: Exposes CRUD operations for the **OperationKitItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationKitItems
      * const operationKitItems = await prisma.operationKitItem.findMany()
      * ```
      */
    get operationKitItem(): Prisma.OperationKitItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.checklistTemplate`: Exposes CRUD operations for the **ChecklistTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ChecklistTemplates
      * const checklistTemplates = await prisma.checklistTemplate.findMany()
      * ```
      */
    get checklistTemplate(): Prisma.ChecklistTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.checklistTemplateItem`: Exposes CRUD operations for the **ChecklistTemplateItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ChecklistTemplateItems
      * const checklistTemplateItems = await prisma.checklistTemplateItem.findMany()
      * ```
      */
    get checklistTemplateItem(): Prisma.ChecklistTemplateItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationCase`: Exposes CRUD operations for the **OperationCase** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationCases
      * const operationCases = await prisma.operationCase.findMany()
      * ```
      */
    get operationCase(): Prisma.OperationCaseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationProcedureItem`: Exposes CRUD operations for the **OperationProcedureItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationProcedureItems
      * const operationProcedureItems = await prisma.operationProcedureItem.findMany()
      * ```
      */
    get operationProcedureItem(): Prisma.OperationProcedureItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationTeamMember`: Exposes CRUD operations for the **OperationTeamMember** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationTeamMembers
      * const operationTeamMembers = await prisma.operationTeamMember.findMany()
      * ```
      */
    get operationTeamMember(): Prisma.OperationTeamMemberDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationConsent`: Exposes CRUD operations for the **OperationConsent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationConsents
      * const operationConsents = await prisma.operationConsent.findMany()
      * ```
      */
    get operationConsent(): Prisma.OperationConsentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.consentTemplate`: Exposes CRUD operations for the **ConsentTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ConsentTemplates
      * const consentTemplates = await prisma.consentTemplate.findMany()
      * ```
      */
    get consentTemplate(): Prisma.ConsentTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.patientConsent`: Exposes CRUD operations for the **PatientConsent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PatientConsents
      * const patientConsents = await prisma.patientConsent.findMany()
      * ```
      */
    get patientConsent(): Prisma.PatientConsentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.preAnestheticAssessment`: Exposes CRUD operations for the **PreAnestheticAssessment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PreAnestheticAssessments
      * const preAnestheticAssessments = await prisma.preAnestheticAssessment.findMany()
      * ```
      */
    get preAnestheticAssessment(): Prisma.PreAnestheticAssessmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationChecklistRun`: Exposes CRUD operations for the **OperationChecklistRun** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationChecklistRuns
      * const operationChecklistRuns = await prisma.operationChecklistRun.findMany()
      * ```
      */
    get operationChecklistRun(): Prisma.OperationChecklistRunDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationChecklistItemRun`: Exposes CRUD operations for the **OperationChecklistItemRun** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationChecklistItemRuns
      * const operationChecklistItemRuns = await prisma.operationChecklistItemRun.findMany()
      * ```
      */
    get operationChecklistItemRun(): Prisma.OperationChecklistItemRunDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.anesthesiaRecord`: Exposes CRUD operations for the **AnesthesiaRecord** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AnesthesiaRecords
      * const anesthesiaRecords = await prisma.anesthesiaRecord.findMany()
      * ```
      */
    get anesthesiaRecord(): Prisma.AnesthesiaRecordDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.anesthesiaEvent`: Exposes CRUD operations for the **AnesthesiaEvent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AnesthesiaEvents
      * const anesthesiaEvents = await prisma.anesthesiaEvent.findMany()
      * ```
      */
    get anesthesiaEvent(): Prisma.AnesthesiaEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationNote`: Exposes CRUD operations for the **OperationNote** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationNotes
      * const operationNotes = await prisma.operationNote.findMany()
      * ```
      */
    get operationNote(): Prisma.OperationNoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationCount`: Exposes CRUD operations for the **OperationCount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationCounts
      * const operationCounts = await prisma.operationCount.findMany()
      * ```
      */
    get operationCount(): Prisma.OperationCountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationImplant`: Exposes CRUD operations for the **OperationImplant** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationImplants
      * const operationImplants = await prisma.operationImplant.findMany()
      * ```
      */
    get operationImplant(): Prisma.OperationImplantDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationSpecimen`: Exposes CRUD operations for the **OperationSpecimen** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationSpecimen
      * const operationSpecimen = await prisma.operationSpecimen.findMany()
      * ```
      */
    get operationSpecimen(): Prisma.OperationSpecimenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.recoveryAssessment`: Exposes CRUD operations for the **RecoveryAssessment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RecoveryAssessments
      * const recoveryAssessments = await prisma.recoveryAssessment.findMany()
      * ```
      */
    get recoveryAssessment(): Prisma.RecoveryAssessmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.postOpOrder`: Exposes CRUD operations for the **PostOpOrder** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PostOpOrders
      * const postOpOrders = await prisma.postOpOrder.findMany()
      * ```
      */
    get postOpOrder(): Prisma.PostOpOrderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationConsumable`: Exposes CRUD operations for the **OperationConsumable** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationConsumables
      * const operationConsumables = await prisma.operationConsumable.findMany()
      * ```
      */
    get operationConsumable(): Prisma.OperationConsumableDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationComplication`: Exposes CRUD operations for the **OperationComplication** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationComplications
      * const operationComplications = await prisma.operationComplication.findMany()
      * ```
      */
    get operationComplication(): Prisma.OperationComplicationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationComment`: Exposes CRUD operations for the **OperationComment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationComments
      * const operationComments = await prisma.operationComment.findMany()
      * ```
      */
    get operationComment(): Prisma.OperationCommentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationCommentMention`: Exposes CRUD operations for the **OperationCommentMention** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationCommentMentions
      * const operationCommentMentions = await prisma.operationCommentMention.findMany()
      * ```
      */
    get operationCommentMention(): Prisma.OperationCommentMentionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.operationActivity`: Exposes CRUD operations for the **OperationActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OperationActivities
      * const operationActivities = await prisma.operationActivity.findMany()
      * ```
      */
    get operationActivity(): Prisma.OperationActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.branch`: Exposes CRUD operations for the **Branch** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Branches
      * const branches = await prisma.branch.findMany()
      * ```
      */
    get branch(): Prisma.BranchDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.room`: Exposes CRUD operations for the **Room** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Rooms
      * const rooms = await prisma.room.findMany()
      * ```
      */
    get room(): Prisma.RoomDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.branchUser`: Exposes CRUD operations for the **BranchUser** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BranchUsers
      * const branchUsers = await prisma.branchUser.findMany()
      * ```
      */
    get branchUser(): Prisma.BranchUserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.specialization`: Exposes CRUD operations for the **Specialization** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Specializations
      * const specializations = await prisma.specialization.findMany()
      * ```
      */
    get specialization(): Prisma.SpecializationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.consultationType`: Exposes CRUD operations for the **ConsultationType** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ConsultationTypes
      * const consultationTypes = await prisma.consultationType.findMany()
      * ```
      */
    get consultationType(): Prisma.ConsultationTypeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.consultationTypeConfig`: Exposes CRUD operations for the **ConsultationTypeConfig** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ConsultationTypeConfigs
      * const consultationTypeConfigs = await prisma.consultationTypeConfig.findMany()
      * ```
      */
    get consultationTypeConfig(): Prisma.ConsultationTypeConfigDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffRole`: Exposes CRUD operations for the **StaffRole** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffRoles
      * const staffRoles = await prisma.staffRole.findMany()
      * ```
      */
    get staffRole(): Prisma.StaffRoleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.permission`: Exposes CRUD operations for the **Permission** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Permissions
      * const permissions = await prisma.permission.findMany()
      * ```
      */
    get permission(): Prisma.PermissionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.rolePermission`: Exposes CRUD operations for the **RolePermission** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RolePermissions
      * const rolePermissions = await prisma.rolePermission.findMany()
      * ```
      */
    get rolePermission(): Prisma.RolePermissionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffRoleAssignment`: Exposes CRUD operations for the **StaffRoleAssignment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffRoleAssignments
      * const staffRoleAssignments = await prisma.staffRoleAssignment.findMany()
      * ```
      */
    get staffRoleAssignment(): Prisma.StaffRoleAssignmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.permissionAuditLog`: Exposes CRUD operations for the **PermissionAuditLog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PermissionAuditLogs
      * const permissionAuditLogs = await prisma.permissionAuditLog.findMany()
      * ```
      */
    get permissionAuditLog(): Prisma.PermissionAuditLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staff`: Exposes CRUD operations for the **Staff** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Staff
      * const staff = await prisma.staff.findMany()
      * ```
      */
    get staff(): Prisma.StaffDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffDocument`: Exposes CRUD operations for the **StaffDocument** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffDocuments
      * const staffDocuments = await prisma.staffDocument.findMany()
      * ```
      */
    get staffDocument(): Prisma.StaffDocumentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicDocument`: Exposes CRUD operations for the **ClinicDocument** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicDocuments
      * const clinicDocuments = await prisma.clinicDocument.findMany()
      * ```
      */
    get clinicDocument(): Prisma.ClinicDocumentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.payrollRun`: Exposes CRUD operations for the **PayrollRun** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PayrollRuns
      * const payrollRuns = await prisma.payrollRun.findMany()
      * ```
      */
    get payrollRun(): Prisma.PayrollRunDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.payrollLine`: Exposes CRUD operations for the **PayrollLine** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PayrollLines
      * const payrollLines = await prisma.payrollLine.findMany()
      * ```
      */
    get payrollLine(): Prisma.PayrollLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.payrollLineEarning`: Exposes CRUD operations for the **PayrollLineEarning** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PayrollLineEarnings
      * const payrollLineEarnings = await prisma.payrollLineEarning.findMany()
      * ```
      */
    get payrollLineEarning(): Prisma.PayrollLineEarningDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.endOfServiceSettlement`: Exposes CRUD operations for the **EndOfServiceSettlement** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more EndOfServiceSettlements
      * const endOfServiceSettlements = await prisma.endOfServiceSettlement.findMany()
      * ```
      */
    get endOfServiceSettlement(): Prisma.EndOfServiceSettlementDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.payrollLineDeduction`: Exposes CRUD operations for the **PayrollLineDeduction** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PayrollLineDeductions
      * const payrollLineDeductions = await prisma.payrollLineDeduction.findMany()
      * ```
      */
    get payrollLineDeduction(): Prisma.PayrollLineDeductionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.payrollApprovalStep`: Exposes CRUD operations for the **PayrollApprovalStep** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PayrollApprovalSteps
      * const payrollApprovalSteps = await prisma.payrollApprovalStep.findMany()
      * ```
      */
    get payrollApprovalStep(): Prisma.PayrollApprovalStepDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicLeaveType`: Exposes CRUD operations for the **ClinicLeaveType** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicLeaveTypes
      * const clinicLeaveTypes = await prisma.clinicLeaveType.findMany()
      * ```
      */
    get clinicLeaveType(): Prisma.ClinicLeaveTypeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicPayrollSettings`: Exposes CRUD operations for the **ClinicPayrollSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicPayrollSettings
      * const clinicPayrollSettings = await prisma.clinicPayrollSettings.findMany()
      * ```
      */
    get clinicPayrollSettings(): Prisma.ClinicPayrollSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffCompensation`: Exposes CRUD operations for the **StaffCompensation** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffCompensations
      * const staffCompensations = await prisma.staffCompensation.findMany()
      * ```
      */
    get staffCompensation(): Prisma.StaffCompensationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffAllowance`: Exposes CRUD operations for the **StaffAllowance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffAllowances
      * const staffAllowances = await prisma.staffAllowance.findMany()
      * ```
      */
    get staffAllowance(): Prisma.StaffAllowanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.attendance`: Exposes CRUD operations for the **Attendance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Attendances
      * const attendances = await prisma.attendance.findMany()
      * ```
      */
    get attendance(): Prisma.AttendanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.shiftAssignment`: Exposes CRUD operations for the **ShiftAssignment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ShiftAssignments
      * const shiftAssignments = await prisma.shiftAssignment.findMany()
      * ```
      */
    get shiftAssignment(): Prisma.ShiftAssignmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.leaveRequest`: Exposes CRUD operations for the **LeaveRequest** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LeaveRequests
      * const leaveRequests = await prisma.leaveRequest.findMany()
      * ```
      */
    get leaveRequest(): Prisma.LeaveRequestDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.leaveAttachment`: Exposes CRUD operations for the **LeaveAttachment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LeaveAttachments
      * const leaveAttachments = await prisma.leaveAttachment.findMany()
      * ```
      */
    get leaveAttachment(): Prisma.LeaveAttachmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.leaveApprovalStep`: Exposes CRUD operations for the **LeaveApprovalStep** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LeaveApprovalSteps
      * const leaveApprovalSteps = await prisma.leaveApprovalStep.findMany()
      * ```
      */
    get leaveApprovalStep(): Prisma.LeaveApprovalStepDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.compensatoryEntry`: Exposes CRUD operations for the **CompensatoryEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CompensatoryEntries
      * const compensatoryEntries = await prisma.compensatoryEntry.findMany()
      * ```
      */
    get compensatoryEntry(): Prisma.CompensatoryEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffSchedulingSettings`: Exposes CRUD operations for the **StaffSchedulingSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffSchedulingSettings
      * const staffSchedulingSettings = await prisma.staffSchedulingSettings.findMany()
      * ```
      */
    get staffSchedulingSettings(): Prisma.StaffSchedulingSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffWorkingHour`: Exposes CRUD operations for the **StaffWorkingHour** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffWorkingHours
      * const staffWorkingHours = await prisma.staffWorkingHour.findMany()
      * ```
      */
    get staffWorkingHour(): Prisma.StaffWorkingHourDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffService`: Exposes CRUD operations for the **StaffService** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffServices
      * const staffServices = await prisma.staffService.findMany()
      * ```
      */
    get staffService(): Prisma.StaffServiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffConsultationType`: Exposes CRUD operations for the **StaffConsultationType** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffConsultationTypes
      * const staffConsultationTypes = await prisma.staffConsultationType.findMany()
      * ```
      */
    get staffConsultationType(): Prisma.StaffConsultationTypeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.animalType`: Exposes CRUD operations for the **AnimalType** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AnimalTypes
      * const animalTypes = await prisma.animalType.findMany()
      * ```
      */
    get animalType(): Prisma.AnimalTypeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.animalStrain`: Exposes CRUD operations for the **AnimalStrain** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AnimalStrains
      * const animalStrains = await prisma.animalStrain.findMany()
      * ```
      */
    get animalStrain(): Prisma.AnimalStrainDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.owner`: Exposes CRUD operations for the **Owner** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Owners
      * const owners = await prisma.owner.findMany()
      * ```
      */
    get owner(): Prisma.OwnerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Patients
      * const patients = await prisma.patient.findMany()
      * ```
      */
    get patient(): Prisma.PatientDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.patientGuardian`: Exposes CRUD operations for the **PatientGuardian** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PatientGuardians
      * const patientGuardians = await prisma.patientGuardian.findMany()
      * ```
      */
    get patientGuardian(): Prisma.PatientGuardianDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.classroom`: Exposes CRUD operations for the **Classroom** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Classrooms
      * const classrooms = await prisma.classroom.findMany()
      * ```
      */
    get classroom(): Prisma.ClassroomDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.classroomStudent`: Exposes CRUD operations for the **ClassroomStudent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClassroomStudents
      * const classroomStudents = await prisma.classroomStudent.findMany()
      * ```
      */
    get classroomStudent(): Prisma.ClassroomStudentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.classroomStaff`: Exposes CRUD operations for the **ClassroomStaff** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClassroomStaffs
      * const classroomStaffs = await prisma.classroomStaff.findMany()
      * ```
      */
    get classroomStaff(): Prisma.ClassroomStaffDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.classroomClassification`: Exposes CRUD operations for the **ClassroomClassification** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClassroomClassifications
      * const classroomClassifications = await prisma.classroomClassification.findMany()
      * ```
      */
    get classroomClassification(): Prisma.ClassroomClassificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.academicStage`: Exposes CRUD operations for the **AcademicStage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AcademicStages
      * const academicStages = await prisma.academicStage.findMany()
      * ```
      */
    get academicStage(): Prisma.AcademicStageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.trackClassification`: Exposes CRUD operations for the **TrackClassification** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TrackClassifications
      * const trackClassifications = await prisma.trackClassification.findMany()
      * ```
      */
    get trackClassification(): Prisma.TrackClassificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.track`: Exposes CRUD operations for the **Track** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Tracks
      * const tracks = await prisma.track.findMany()
      * ```
      */
    get track(): Prisma.TrackDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.trackStudent`: Exposes CRUD operations for the **TrackStudent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TrackStudents
      * const trackStudents = await prisma.trackStudent.findMany()
      * ```
      */
    get trackStudent(): Prisma.TrackStudentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.trackStaff`: Exposes CRUD operations for the **TrackStaff** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TrackStaffs
      * const trackStaffs = await prisma.trackStaff.findMany()
      * ```
      */
    get trackStaff(): Prisma.TrackStaffDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.patientActivity`: Exposes CRUD operations for the **PatientActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PatientActivities
      * const patientActivities = await prisma.patientActivity.findMany()
      * ```
      */
    get patientActivity(): Prisma.PatientActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.vitalSignsRecord`: Exposes CRUD operations for the **VitalSignsRecord** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more VitalSignsRecords
      * const vitalSignsRecords = await prisma.vitalSignsRecord.findMany()
      * ```
      */
    get vitalSignsRecord(): Prisma.VitalSignsRecordDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Appointments
      * const appointments = await prisma.appointment.findMany()
      * ```
      */
    get appointment(): Prisma.AppointmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.appointmentQuestionnaire`: Exposes CRUD operations for the **AppointmentQuestionnaire** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AppointmentQuestionnaires
      * const appointmentQuestionnaires = await prisma.appointmentQuestionnaire.findMany()
      * ```
      */
    get appointmentQuestionnaire(): Prisma.AppointmentQuestionnaireDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.appointmentInternalNote`: Exposes CRUD operations for the **AppointmentInternalNote** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AppointmentInternalNotes
      * const appointmentInternalNotes = await prisma.appointmentInternalNote.findMany()
      * ```
      */
    get appointmentInternalNote(): Prisma.AppointmentInternalNoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.appointmentInternalNoteMention`: Exposes CRUD operations for the **AppointmentInternalNoteMention** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AppointmentInternalNoteMentions
      * const appointmentInternalNoteMentions = await prisma.appointmentInternalNoteMention.findMany()
      * ```
      */
    get appointmentInternalNoteMention(): Prisma.AppointmentInternalNoteMentionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.appointmentActivity`: Exposes CRUD operations for the **AppointmentActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AppointmentActivities
      * const appointmentActivities = await prisma.appointmentActivity.findMany()
      * ```
      */
    get appointmentActivity(): Prisma.AppointmentActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicalExam`: Exposes CRUD operations for the **ClinicalExam** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicalExams
      * const clinicalExams = await prisma.clinicalExam.findMany()
      * ```
      */
    get clinicalExam(): Prisma.ClinicalExamDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.examTemplate`: Exposes CRUD operations for the **ExamTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ExamTemplates
      * const examTemplates = await prisma.examTemplate.findMany()
      * ```
      */
    get examTemplate(): Prisma.ExamTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicalNote`: Exposes CRUD operations for the **ClinicalNote** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicalNotes
      * const clinicalNotes = await prisma.clinicalNote.findMany()
      * ```
      */
    get clinicalNote(): Prisma.ClinicalNoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicalNoteDiagnosis`: Exposes CRUD operations for the **ClinicalNoteDiagnosis** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicalNoteDiagnoses
      * const clinicalNoteDiagnoses = await prisma.clinicalNoteDiagnosis.findMany()
      * ```
      */
    get clinicalNoteDiagnosis(): Prisma.ClinicalNoteDiagnosisDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicalNoteAddendum`: Exposes CRUD operations for the **ClinicalNoteAddendum** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicalNoteAddenda
      * const clinicalNoteAddenda = await prisma.clinicalNoteAddendum.findMany()
      * ```
      */
    get clinicalNoteAddendum(): Prisma.ClinicalNoteAddendumDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.appointmentService`: Exposes CRUD operations for the **AppointmentService** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AppointmentServices
      * const appointmentServices = await prisma.appointmentService.findMany()
      * ```
      */
    get appointmentService(): Prisma.AppointmentServiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.appointmentProduct`: Exposes CRUD operations for the **AppointmentProduct** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AppointmentProducts
      * const appointmentProducts = await prisma.appointmentProduct.findMany()
      * ```
      */
    get appointmentProduct(): Prisma.AppointmentProductDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Invoices
      * const invoices = await prisma.invoice.findMany()
      * ```
      */
    get invoice(): Prisma.InvoiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.invoiceTax`: Exposes CRUD operations for the **InvoiceTax** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InvoiceTaxes
      * const invoiceTaxes = await prisma.invoiceTax.findMany()
      * ```
      */
    get invoiceTax(): Prisma.InvoiceTaxDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.appointmentDocument`: Exposes CRUD operations for the **AppointmentDocument** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AppointmentDocuments
      * const appointmentDocuments = await prisma.appointmentDocument.findMany()
      * ```
      */
    get appointmentDocument(): Prisma.AppointmentDocumentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inventoryItem`: Exposes CRUD operations for the **InventoryItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InventoryItems
      * const inventoryItems = await prisma.inventoryItem.findMany()
      * ```
      */
    get inventoryItem(): Prisma.InventoryItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.productComment`: Exposes CRUD operations for the **ProductComment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ProductComments
      * const productComments = await prisma.productComment.findMany()
      * ```
      */
    get productComment(): Prisma.ProductCommentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.supplier`: Exposes CRUD operations for the **Supplier** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Suppliers
      * const suppliers = await prisma.supplier.findMany()
      * ```
      */
    get supplier(): Prisma.SupplierDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.sale`: Exposes CRUD operations for the **Sale** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Sales
      * const sales = await prisma.sale.findMany()
      * ```
      */
    get sale(): Prisma.SaleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.dunningType`: Exposes CRUD operations for the **DunningType** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DunningTypes
      * const dunningTypes = await prisma.dunningType.findMany()
      * ```
      */
    get dunningType(): Prisma.DunningTypeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.repostAccountingLedger`: Exposes CRUD operations for the **RepostAccountingLedger** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RepostAccountingLedgers
      * const repostAccountingLedgers = await prisma.repostAccountingLedger.findMany()
      * ```
      */
    get repostAccountingLedger(): Prisma.RepostAccountingLedgerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.repostAccountingLedgerItem`: Exposes CRUD operations for the **RepostAccountingLedgerItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RepostAccountingLedgerItems
      * const repostAccountingLedgerItems = await prisma.repostAccountingLedgerItem.findMany()
      * ```
      */
    get repostAccountingLedgerItem(): Prisma.RepostAccountingLedgerItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.processStatementOfAccounts`: Exposes CRUD operations for the **ProcessStatementOfAccounts** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ProcessStatementOfAccounts
      * const processStatementOfAccounts = await prisma.processStatementOfAccounts.findMany()
      * ```
      */
    get processStatementOfAccounts(): Prisma.ProcessStatementOfAccountsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.psoaCustomer`: Exposes CRUD operations for the **PsoaCustomer** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PsoaCustomers
      * const psoaCustomers = await prisma.psoaCustomer.findMany()
      * ```
      */
    get psoaCustomer(): Prisma.PsoaCustomerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.dunning`: Exposes CRUD operations for the **Dunning** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Dunnings
      * const dunnings = await prisma.dunning.findMany()
      * ```
      */
    get dunning(): Prisma.DunningDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.dunningOverdue`: Exposes CRUD operations for the **DunningOverdue** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DunningOverdues
      * const dunningOverdues = await prisma.dunningOverdue.findMany()
      * ```
      */
    get dunningOverdue(): Prisma.DunningOverdueDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Subscriptions
      * const subscriptions = await prisma.subscription.findMany()
      * ```
      */
    get subscription(): Prisma.SubscriptionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.subscriptionPlan`: Exposes CRUD operations for the **SubscriptionPlan** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SubscriptionPlans
      * const subscriptionPlans = await prisma.subscriptionPlan.findMany()
      * ```
      */
    get subscriptionPlan(): Prisma.SubscriptionPlanDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.subscriptionInvoice`: Exposes CRUD operations for the **SubscriptionInvoice** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SubscriptionInvoices
      * const subscriptionInvoices = await prisma.subscriptionInvoice.findMany()
      * ```
      */
    get subscriptionInvoice(): Prisma.SubscriptionInvoiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.posProfile`: Exposes CRUD operations for the **PosProfile** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PosProfiles
      * const posProfiles = await prisma.posProfile.findMany()
      * ```
      */
    get posProfile(): Prisma.PosProfileDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.posProfileUser`: Exposes CRUD operations for the **PosProfileUser** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PosProfileUsers
      * const posProfileUsers = await prisma.posProfileUser.findMany()
      * ```
      */
    get posProfileUser(): Prisma.PosProfileUserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.posOpeningEntry`: Exposes CRUD operations for the **PosOpeningEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PosOpeningEntries
      * const posOpeningEntries = await prisma.posOpeningEntry.findMany()
      * ```
      */
    get posOpeningEntry(): Prisma.PosOpeningEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.posOpeningBalance`: Exposes CRUD operations for the **PosOpeningBalance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PosOpeningBalances
      * const posOpeningBalances = await prisma.posOpeningBalance.findMany()
      * ```
      */
    get posOpeningBalance(): Prisma.PosOpeningBalanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.posClosingEntry`: Exposes CRUD operations for the **PosClosingEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PosClosingEntries
      * const posClosingEntries = await prisma.posClosingEntry.findMany()
      * ```
      */
    get posClosingEntry(): Prisma.PosClosingEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.posClosingBalance`: Exposes CRUD operations for the **PosClosingBalance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PosClosingBalances
      * const posClosingBalances = await prisma.posClosingBalance.findMany()
      * ```
      */
    get posClosingBalance(): Prisma.PosClosingBalanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.saleTax`: Exposes CRUD operations for the **SaleTax** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SaleTaxes
      * const saleTaxes = await prisma.saleTax.findMany()
      * ```
      */
    get saleTax(): Prisma.SaleTaxDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.saleItem`: Exposes CRUD operations for the **SaleItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SaleItems
      * const saleItems = await prisma.saleItem.findMany()
      * ```
      */
    get saleItem(): Prisma.SaleItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.stockLedgerEntry`: Exposes CRUD operations for the **StockLedgerEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StockLedgerEntries
      * const stockLedgerEntries = await prisma.stockLedgerEntry.findMany()
      * ```
      */
    get stockLedgerEntry(): Prisma.StockLedgerEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.warehouse`: Exposes CRUD operations for the **Warehouse** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Warehouses
      * const warehouses = await prisma.warehouse.findMany()
      * ```
      */
    get warehouse(): Prisma.WarehouseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.stockBin`: Exposes CRUD operations for the **StockBin** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StockBins
      * const stockBins = await prisma.stockBin.findMany()
      * ```
      */
    get stockBin(): Prisma.StockBinDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.stockBatch`: Exposes CRUD operations for the **StockBatch** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StockBatches
      * const stockBatches = await prisma.stockBatch.findMany()
      * ```
      */
    get stockBatch(): Prisma.StockBatchDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.purchaseOrder`: Exposes CRUD operations for the **PurchaseOrder** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PurchaseOrders
      * const purchaseOrders = await prisma.purchaseOrder.findMany()
      * ```
      */
    get purchaseOrder(): Prisma.PurchaseOrderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.purchaseOrderItem`: Exposes CRUD operations for the **PurchaseOrderItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PurchaseOrderItems
      * const purchaseOrderItems = await prisma.purchaseOrderItem.findMany()
      * ```
      */
    get purchaseOrderItem(): Prisma.PurchaseOrderItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.discount`: Exposes CRUD operations for the **Discount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Discounts
      * const discounts = await prisma.discount.findMany()
      * ```
      */
    get discount(): Prisma.DiscountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.expense`: Exposes CRUD operations for the **Expense** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Expenses
      * const expenses = await prisma.expense.findMany()
      * ```
      */
    get expense(): Prisma.ExpenseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.expenseAttachment`: Exposes CRUD operations for the **ExpenseAttachment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ExpenseAttachments
      * const expenseAttachments = await prisma.expenseAttachment.findMany()
      * ```
      */
    get expenseAttachment(): Prisma.ExpenseAttachmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.expenseApprovalStep`: Exposes CRUD operations for the **ExpenseApprovalStep** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ExpenseApprovalSteps
      * const expenseApprovalSteps = await prisma.expenseApprovalStep.findMany()
      * ```
      */
    get expenseApprovalStep(): Prisma.ExpenseApprovalStepDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.carePlan`: Exposes CRUD operations for the **CarePlan** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CarePlans
      * const carePlans = await prisma.carePlan.findMany()
      * ```
      */
    get carePlan(): Prisma.CarePlanDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.carePlanVisit`: Exposes CRUD operations for the **CarePlanVisit** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CarePlanVisits
      * const carePlanVisits = await prisma.carePlanVisit.findMany()
      * ```
      */
    get carePlanVisit(): Prisma.CarePlanVisitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.carePlanMedication`: Exposes CRUD operations for the **CarePlanMedication** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CarePlanMedications
      * const carePlanMedications = await prisma.carePlanMedication.findMany()
      * ```
      */
    get carePlanMedication(): Prisma.CarePlanMedicationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.carePlanVisitMedication`: Exposes CRUD operations for the **CarePlanVisitMedication** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CarePlanVisitMedications
      * const carePlanVisitMedications = await prisma.carePlanVisitMedication.findMany()
      * ```
      */
    get carePlanVisitMedication(): Prisma.CarePlanVisitMedicationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.carePlanEnrollment`: Exposes CRUD operations for the **CarePlanEnrollment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CarePlanEnrollments
      * const carePlanEnrollments = await prisma.carePlanEnrollment.findMany()
      * ```
      */
    get carePlanEnrollment(): Prisma.CarePlanEnrollmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.carePlanEnrollmentVisit`: Exposes CRUD operations for the **CarePlanEnrollmentVisit** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CarePlanEnrollmentVisits
      * const carePlanEnrollmentVisits = await prisma.carePlanEnrollmentVisit.findMany()
      * ```
      */
    get carePlanEnrollmentVisit(): Prisma.CarePlanEnrollmentVisitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.carePlanEnrollmentVisitMedication`: Exposes CRUD operations for the **CarePlanEnrollmentVisitMedication** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CarePlanEnrollmentVisitMedications
      * const carePlanEnrollmentVisitMedications = await prisma.carePlanEnrollmentVisitMedication.findMany()
      * ```
      */
    get carePlanEnrollmentVisitMedication(): Prisma.CarePlanEnrollmentVisitMedicationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.user`: Exposes CRUD operations for the **User** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Users
      * const users = await prisma.user.findMany()
      * ```
      */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.session`: Exposes CRUD operations for the **Session** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Sessions
      * const sessions = await prisma.session.findMany()
      * ```
      */
    get session(): Prisma.SessionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.account`: Exposes CRUD operations for the **Account** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Accounts
      * const accounts = await prisma.account.findMany()
      * ```
      */
    get account(): Prisma.AccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Verifications
      * const verifications = await prisma.verification.findMany()
      * ```
      */
    get verification(): Prisma.VerificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.course`: Exposes CRUD operations for the **Course** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Courses
      * const courses = await prisma.course.findMany()
      * ```
      */
    get course(): Prisma.CourseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseLevel`: Exposes CRUD operations for the **CourseLevel** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseLevels
      * const courseLevels = await prisma.courseLevel.findMany()
      * ```
      */
    get courseLevel(): Prisma.CourseLevelDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseUnit`: Exposes CRUD operations for the **CourseUnit** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseUnits
      * const courseUnits = await prisma.courseUnit.findMany()
      * ```
      */
    get courseUnit(): Prisma.CourseUnitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseLesson`: Exposes CRUD operations for the **CourseLesson** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseLessons
      * const courseLessons = await prisma.courseLesson.findMany()
      * ```
      */
    get courseLesson(): Prisma.CourseLessonDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseAssignment`: Exposes CRUD operations for the **CourseAssignment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseAssignments
      * const courseAssignments = await prisma.courseAssignment.findMany()
      * ```
      */
    get courseAssignment(): Prisma.CourseAssignmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseAssignmentLessonProgress`: Exposes CRUD operations for the **CourseAssignmentLessonProgress** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseAssignmentLessonProgresses
      * const courseAssignmentLessonProgresses = await prisma.courseAssignmentLessonProgress.findMany()
      * ```
      */
    get courseAssignmentLessonProgress(): Prisma.CourseAssignmentLessonProgressDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseAutoAssignRule`: Exposes CRUD operations for the **CourseAutoAssignRule** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseAutoAssignRules
      * const courseAutoAssignRules = await prisma.courseAutoAssignRule.findMany()
      * ```
      */
    get courseAutoAssignRule(): Prisma.CourseAutoAssignRuleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseCompletionSettings`: Exposes CRUD operations for the **CourseCompletionSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseCompletionSettings
      * const courseCompletionSettings = await prisma.courseCompletionSettings.findMany()
      * ```
      */
    get courseCompletionSettings(): Prisma.CourseCompletionSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseTrainer`: Exposes CRUD operations for the **CourseTrainer** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseTrainers
      * const courseTrainers = await prisma.courseTrainer.findMany()
      * ```
      */
    get courseTrainer(): Prisma.CourseTrainerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseReview`: Exposes CRUD operations for the **CourseReview** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseReviews
      * const courseReviews = await prisma.courseReview.findMany()
      * ```
      */
    get courseReview(): Prisma.CourseReviewDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseCertificate`: Exposes CRUD operations for the **CourseCertificate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseCertificates
      * const courseCertificates = await prisma.courseCertificate.findMany()
      * ```
      */
    get courseCertificate(): Prisma.CourseCertificateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.quiz`: Exposes CRUD operations for the **Quiz** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Quizzes
      * const quizzes = await prisma.quiz.findMany()
      * ```
      */
    get quiz(): Prisma.QuizDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.quizQuestion`: Exposes CRUD operations for the **QuizQuestion** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more QuizQuestions
      * const quizQuestions = await prisma.quizQuestion.findMany()
      * ```
      */
    get quizQuestion(): Prisma.QuizQuestionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.quizAssignment`: Exposes CRUD operations for the **QuizAssignment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more QuizAssignments
      * const quizAssignments = await prisma.quizAssignment.findMany()
      * ```
      */
    get quizAssignment(): Prisma.QuizAssignmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.quizAttempt`: Exposes CRUD operations for the **QuizAttempt** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more QuizAttempts
      * const quizAttempts = await prisma.quizAttempt.findMany()
      * ```
      */
    get quizAttempt(): Prisma.QuizAttemptDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.quizAnswer`: Exposes CRUD operations for the **QuizAnswer** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more QuizAnswers
      * const quizAnswers = await prisma.quizAnswer.findMany()
      * ```
      */
    get quizAnswer(): Prisma.QuizAnswerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.currency`: Exposes CRUD operations for the **Currency** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Currencies
      * const currencies = await prisma.currency.findMany()
      * ```
      */
    get currency(): Prisma.CurrencyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.namingSeries`: Exposes CRUD operations for the **NamingSeries** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more NamingSeries
      * const namingSeries = await prisma.namingSeries.findMany()
      * ```
      */
    get namingSeries(): Prisma.NamingSeriesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicAccountingSettings`: Exposes CRUD operations for the **ClinicAccountingSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicAccountingSettings
      * const clinicAccountingSettings = await prisma.clinicAccountingSettings.findMany()
      * ```
      */
    get clinicAccountingSettings(): Prisma.ClinicAccountingSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.voucherDemo`: Exposes CRUD operations for the **VoucherDemo** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more VoucherDemos
      * const voucherDemos = await prisma.voucherDemo.findMany()
      * ```
      */
    get voucherDemo(): Prisma.VoucherDemoDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.accountsSetting`: Exposes CRUD operations for the **AccountsSetting** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AccountsSettings
      * const accountsSettings = await prisma.accountsSetting.findMany()
      * ```
      */
    get accountsSetting(): Prisma.AccountsSettingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.accountingJob`: Exposes CRUD operations for the **AccountingJob** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AccountingJobs
      * const accountingJobs = await prisma.accountingJob.findMany()
      * ```
      */
    get accountingJob(): Prisma.AccountingJobDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.ledgerAccount`: Exposes CRUD operations for the **LedgerAccount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LedgerAccounts
      * const ledgerAccounts = await prisma.ledgerAccount.findMany()
      * ```
      */
    get ledgerAccount(): Prisma.LedgerAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.fiscalYear`: Exposes CRUD operations for the **FiscalYear** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more FiscalYears
      * const fiscalYears = await prisma.fiscalYear.findMany()
      * ```
      */
    get fiscalYear(): Prisma.FiscalYearDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.accountingPeriod`: Exposes CRUD operations for the **AccountingPeriod** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AccountingPeriods
      * const accountingPeriods = await prisma.accountingPeriod.findMany()
      * ```
      */
    get accountingPeriod(): Prisma.AccountingPeriodDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.accountingPeriodClosedDocument`: Exposes CRUD operations for the **AccountingPeriodClosedDocument** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AccountingPeriodClosedDocuments
      * const accountingPeriodClosedDocuments = await prisma.accountingPeriodClosedDocument.findMany()
      * ```
      */
    get accountingPeriodClosedDocument(): Prisma.AccountingPeriodClosedDocumentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.periodClosingVoucher`: Exposes CRUD operations for the **PeriodClosingVoucher** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PeriodClosingVouchers
      * const periodClosingVouchers = await prisma.periodClosingVoucher.findMany()
      * ```
      */
    get periodClosingVoucher(): Prisma.PeriodClosingVoucherDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.accountClosingBalance`: Exposes CRUD operations for the **AccountClosingBalance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AccountClosingBalances
      * const accountClosingBalances = await prisma.accountClosingBalance.findMany()
      * ```
      */
    get accountClosingBalance(): Prisma.AccountClosingBalanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.budget`: Exposes CRUD operations for the **Budget** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Budgets
      * const budgets = await prisma.budget.findMany()
      * ```
      */
    get budget(): Prisma.BudgetDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.budgetAccount`: Exposes CRUD operations for the **BudgetAccount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BudgetAccounts
      * const budgetAccounts = await prisma.budgetAccount.findMany()
      * ```
      */
    get budgetAccount(): Prisma.BudgetAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.monthlyDistribution`: Exposes CRUD operations for the **MonthlyDistribution** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MonthlyDistributions
      * const monthlyDistributions = await prisma.monthlyDistribution.findMany()
      * ```
      */
    get monthlyDistribution(): Prisma.MonthlyDistributionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.monthlyDistributionPercentage`: Exposes CRUD operations for the **MonthlyDistributionPercentage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MonthlyDistributionPercentages
      * const monthlyDistributionPercentages = await prisma.monthlyDistributionPercentage.findMany()
      * ```
      */
    get monthlyDistributionPercentage(): Prisma.MonthlyDistributionPercentageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.accountingDimensionFilter`: Exposes CRUD operations for the **AccountingDimensionFilter** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AccountingDimensionFilters
      * const accountingDimensionFilters = await prisma.accountingDimensionFilter.findMany()
      * ```
      */
    get accountingDimensionFilter(): Prisma.AccountingDimensionFilterDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.accountingDimensionFilterAccount`: Exposes CRUD operations for the **AccountingDimensionFilterAccount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AccountingDimensionFilterAccounts
      * const accountingDimensionFilterAccounts = await prisma.accountingDimensionFilterAccount.findMany()
      * ```
      */
    get accountingDimensionFilterAccount(): Prisma.AccountingDimensionFilterAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.accountingDimensionFilterValue`: Exposes CRUD operations for the **AccountingDimensionFilterValue** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AccountingDimensionFilterValues
      * const accountingDimensionFilterValues = await prisma.accountingDimensionFilterValue.findMany()
      * ```
      */
    get accountingDimensionFilterValue(): Prisma.AccountingDimensionFilterValueDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.bank`: Exposes CRUD operations for the **Bank** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Banks
      * const banks = await prisma.bank.findMany()
      * ```
      */
    get bank(): Prisma.BankDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.bankAccount`: Exposes CRUD operations for the **BankAccount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BankAccounts
      * const bankAccounts = await prisma.bankAccount.findMany()
      * ```
      */
    get bankAccount(): Prisma.BankAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.bankTransaction`: Exposes CRUD operations for the **BankTransaction** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BankTransactions
      * const bankTransactions = await prisma.bankTransaction.findMany()
      * ```
      */
    get bankTransaction(): Prisma.BankTransactionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.bankTransactionPayment`: Exposes CRUD operations for the **BankTransactionPayment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BankTransactionPayments
      * const bankTransactionPayments = await prisma.bankTransactionPayment.findMany()
      * ```
      */
    get bankTransactionPayment(): Prisma.BankTransactionPaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.bankImportMapping`: Exposes CRUD operations for the **BankImportMapping** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BankImportMappings
      * const bankImportMappings = await prisma.bankImportMapping.findMany()
      * ```
      */
    get bankImportMapping(): Prisma.BankImportMappingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.bankStatementImport`: Exposes CRUD operations for the **BankStatementImport** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BankStatementImports
      * const bankStatementImports = await prisma.bankStatementImport.findMany()
      * ```
      */
    get bankStatementImport(): Prisma.BankStatementImportDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.bankTransactionRule`: Exposes CRUD operations for the **BankTransactionRule** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BankTransactionRules
      * const bankTransactionRules = await prisma.bankTransactionRule.findMany()
      * ```
      */
    get bankTransactionRule(): Prisma.BankTransactionRuleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.costCenter`: Exposes CRUD operations for the **CostCenter** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CostCenters
      * const costCenters = await prisma.costCenter.findMany()
      * ```
      */
    get costCenter(): Prisma.CostCenterDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.costCenterAllocation`: Exposes CRUD operations for the **CostCenterAllocation** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CostCenterAllocations
      * const costCenterAllocations = await prisma.costCenterAllocation.findMany()
      * ```
      */
    get costCenterAllocation(): Prisma.CostCenterAllocationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.costCenterAllocationPercentage`: Exposes CRUD operations for the **CostCenterAllocationPercentage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CostCenterAllocationPercentages
      * const costCenterAllocationPercentages = await prisma.costCenterAllocationPercentage.findMany()
      * ```
      */
    get costCenterAllocationPercentage(): Prisma.CostCenterAllocationPercentageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.modeOfPayment`: Exposes CRUD operations for the **ModeOfPayment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ModeOfPayments
      * const modeOfPayments = await prisma.modeOfPayment.findMany()
      * ```
      */
    get modeOfPayment(): Prisma.ModeOfPaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.currencyExchange`: Exposes CRUD operations for the **CurrencyExchange** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CurrencyExchanges
      * const currencyExchanges = await prisma.currencyExchange.findMany()
      * ```
      */
    get currencyExchange(): Prisma.CurrencyExchangeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.accountingDimension`: Exposes CRUD operations for the **AccountingDimension** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AccountingDimensions
      * const accountingDimensions = await prisma.accountingDimension.findMany()
      * ```
      */
    get accountingDimension(): Prisma.AccountingDimensionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.financeBook`: Exposes CRUD operations for the **FinanceBook** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more FinanceBooks
      * const financeBooks = await prisma.financeBook.findMany()
      * ```
      */
    get financeBook(): Prisma.FinanceBookDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.glEntry`: Exposes CRUD operations for the **GlEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GlEntries
      * const glEntries = await prisma.glEntry.findMany()
      * ```
      */
    get glEntry(): Prisma.GlEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.journalEntry`: Exposes CRUD operations for the **JournalEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more JournalEntries
      * const journalEntries = await prisma.journalEntry.findMany()
      * ```
      */
    get journalEntry(): Prisma.JournalEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.journalEntryAccount`: Exposes CRUD operations for the **JournalEntryAccount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more JournalEntryAccounts
      * const journalEntryAccounts = await prisma.journalEntryAccount.findMany()
      * ```
      */
    get journalEntryAccount(): Prisma.JournalEntryAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.journalEntryTemplate`: Exposes CRUD operations for the **JournalEntryTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more JournalEntryTemplates
      * const journalEntryTemplates = await prisma.journalEntryTemplate.findMany()
      * ```
      */
    get journalEntryTemplate(): Prisma.JournalEntryTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.partyAccount`: Exposes CRUD operations for the **PartyAccount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PartyAccounts
      * const partyAccounts = await prisma.partyAccount.findMany()
      * ```
      */
    get partyAccount(): Prisma.PartyAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.partyCreditLimit`: Exposes CRUD operations for the **PartyCreditLimit** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PartyCreditLimits
      * const partyCreditLimits = await prisma.partyCreditLimit.findMany()
      * ```
      */
    get partyCreditLimit(): Prisma.PartyCreditLimitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.taxCategory`: Exposes CRUD operations for the **TaxCategory** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TaxCategories
      * const taxCategories = await prisma.taxCategory.findMany()
      * ```
      */
    get taxCategory(): Prisma.TaxCategoryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.salesTaxesAndChargesTemplate`: Exposes CRUD operations for the **SalesTaxesAndChargesTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SalesTaxesAndChargesTemplates
      * const salesTaxesAndChargesTemplates = await prisma.salesTaxesAndChargesTemplate.findMany()
      * ```
      */
    get salesTaxesAndChargesTemplate(): Prisma.SalesTaxesAndChargesTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.salesTaxesAndCharges`: Exposes CRUD operations for the **SalesTaxesAndCharges** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SalesTaxesAndCharges
      * const salesTaxesAndCharges = await prisma.salesTaxesAndCharges.findMany()
      * ```
      */
    get salesTaxesAndCharges(): Prisma.SalesTaxesAndChargesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.purchaseTaxesAndChargesTemplate`: Exposes CRUD operations for the **PurchaseTaxesAndChargesTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PurchaseTaxesAndChargesTemplates
      * const purchaseTaxesAndChargesTemplates = await prisma.purchaseTaxesAndChargesTemplate.findMany()
      * ```
      */
    get purchaseTaxesAndChargesTemplate(): Prisma.PurchaseTaxesAndChargesTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.purchaseTaxesAndCharges`: Exposes CRUD operations for the **PurchaseTaxesAndCharges** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PurchaseTaxesAndCharges
      * const purchaseTaxesAndCharges = await prisma.purchaseTaxesAndCharges.findMany()
      * ```
      */
    get purchaseTaxesAndCharges(): Prisma.PurchaseTaxesAndChargesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.itemTaxTemplate`: Exposes CRUD operations for the **ItemTaxTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ItemTaxTemplates
      * const itemTaxTemplates = await prisma.itemTaxTemplate.findMany()
      * ```
      */
    get itemTaxTemplate(): Prisma.ItemTaxTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.itemTaxTemplateDetail`: Exposes CRUD operations for the **ItemTaxTemplateDetail** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ItemTaxTemplateDetails
      * const itemTaxTemplateDetails = await prisma.itemTaxTemplateDetail.findMany()
      * ```
      */
    get itemTaxTemplateDetail(): Prisma.ItemTaxTemplateDetailDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.taxRule`: Exposes CRUD operations for the **TaxRule** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TaxRules
      * const taxRules = await prisma.taxRule.findMany()
      * ```
      */
    get taxRule(): Prisma.TaxRuleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.itemWiseTaxDetail`: Exposes CRUD operations for the **ItemWiseTaxDetail** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ItemWiseTaxDetails
      * const itemWiseTaxDetails = await prisma.itemWiseTaxDetail.findMany()
      * ```
      */
    get itemWiseTaxDetail(): Prisma.ItemWiseTaxDetailDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.paymentTerm`: Exposes CRUD operations for the **PaymentTerm** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PaymentTerms
      * const paymentTerms = await prisma.paymentTerm.findMany()
      * ```
      */
    get paymentTerm(): Prisma.PaymentTermDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.paymentTermsTemplate`: Exposes CRUD operations for the **PaymentTermsTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PaymentTermsTemplates
      * const paymentTermsTemplates = await prisma.paymentTermsTemplate.findMany()
      * ```
      */
    get paymentTermsTemplate(): Prisma.PaymentTermsTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.paymentTermsTemplateDetail`: Exposes CRUD operations for the **PaymentTermsTemplateDetail** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PaymentTermsTemplateDetails
      * const paymentTermsTemplateDetails = await prisma.paymentTermsTemplateDetail.findMany()
      * ```
      */
    get paymentTermsTemplateDetail(): Prisma.PaymentTermsTemplateDetailDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.paymentLedgerEntry`: Exposes CRUD operations for the **PaymentLedgerEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PaymentLedgerEntries
      * const paymentLedgerEntries = await prisma.paymentLedgerEntry.findMany()
      * ```
      */
    get paymentLedgerEntry(): Prisma.PaymentLedgerEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.advancePaymentLedgerEntry`: Exposes CRUD operations for the **AdvancePaymentLedgerEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AdvancePaymentLedgerEntries
      * const advancePaymentLedgerEntries = await prisma.advancePaymentLedgerEntry.findMany()
      * ```
      */
    get advancePaymentLedgerEntry(): Prisma.AdvancePaymentLedgerEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.partyAccountingConfig`: Exposes CRUD operations for the **PartyAccountingConfig** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PartyAccountingConfigs
      * const partyAccountingConfigs = await prisma.partyAccountingConfig.findMany()
      * ```
      */
    get partyAccountingConfig(): Prisma.PartyAccountingConfigDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.taxWithholdingCategory`: Exposes CRUD operations for the **TaxWithholdingCategory** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TaxWithholdingCategories
      * const taxWithholdingCategories = await prisma.taxWithholdingCategory.findMany()
      * ```
      */
    get taxWithholdingCategory(): Prisma.TaxWithholdingCategoryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.taxWithholdingRate`: Exposes CRUD operations for the **TaxWithholdingRate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TaxWithholdingRates
      * const taxWithholdingRates = await prisma.taxWithholdingRate.findMany()
      * ```
      */
    get taxWithholdingRate(): Prisma.TaxWithholdingRateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.taxWithholdingEntry`: Exposes CRUD operations for the **TaxWithholdingEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TaxWithholdingEntries
      * const taxWithholdingEntries = await prisma.taxWithholdingEntry.findMany()
      * ```
      */
    get taxWithholdingEntry(): Prisma.TaxWithholdingEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.salesInvoice`: Exposes CRUD operations for the **SalesInvoice** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SalesInvoices
      * const salesInvoices = await prisma.salesInvoice.findMany()
      * ```
      */
    get salesInvoice(): Prisma.SalesInvoiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.salesInvoiceItem`: Exposes CRUD operations for the **SalesInvoiceItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SalesInvoiceItems
      * const salesInvoiceItems = await prisma.salesInvoiceItem.findMany()
      * ```
      */
    get salesInvoiceItem(): Prisma.SalesInvoiceItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.salesInvoiceTax`: Exposes CRUD operations for the **SalesInvoiceTax** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SalesInvoiceTaxes
      * const salesInvoiceTaxes = await prisma.salesInvoiceTax.findMany()
      * ```
      */
    get salesInvoiceTax(): Prisma.SalesInvoiceTaxDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.paymentSchedule`: Exposes CRUD operations for the **PaymentSchedule** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PaymentSchedules
      * const paymentSchedules = await prisma.paymentSchedule.findMany()
      * ```
      */
    get paymentSchedule(): Prisma.PaymentScheduleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.salesInvoiceAdvance`: Exposes CRUD operations for the **SalesInvoiceAdvance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SalesInvoiceAdvances
      * const salesInvoiceAdvances = await prisma.salesInvoiceAdvance.findMany()
      * ```
      */
    get salesInvoiceAdvance(): Prisma.SalesInvoiceAdvanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.salesInvoicePayment`: Exposes CRUD operations for the **SalesInvoicePayment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SalesInvoicePayments
      * const salesInvoicePayments = await prisma.salesInvoicePayment.findMany()
      * ```
      */
    get salesInvoicePayment(): Prisma.SalesInvoicePaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.conversation`: Exposes CRUD operations for the **Conversation** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Conversations
      * const conversations = await prisma.conversation.findMany()
      * ```
      */
    get conversation(): Prisma.ConversationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.conversationMember`: Exposes CRUD operations for the **ConversationMember** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ConversationMembers
      * const conversationMembers = await prisma.conversationMember.findMany()
      * ```
      */
    get conversationMember(): Prisma.ConversationMemberDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ChatMessages
      * const chatMessages = await prisma.chatMessage.findMany()
      * ```
      */
    get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.purchaseInvoice`: Exposes CRUD operations for the **PurchaseInvoice** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PurchaseInvoices
      * const purchaseInvoices = await prisma.purchaseInvoice.findMany()
      * ```
      */
    get purchaseInvoice(): Prisma.PurchaseInvoiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.purchaseInvoiceItem`: Exposes CRUD operations for the **PurchaseInvoiceItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PurchaseInvoiceItems
      * const purchaseInvoiceItems = await prisma.purchaseInvoiceItem.findMany()
      * ```
      */
    get purchaseInvoiceItem(): Prisma.PurchaseInvoiceItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.deferredScheduleEntry`: Exposes CRUD operations for the **DeferredScheduleEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DeferredScheduleEntries
      * const deferredScheduleEntries = await prisma.deferredScheduleEntry.findMany()
      * ```
      */
    get deferredScheduleEntry(): Prisma.DeferredScheduleEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.processDeferredAccounting`: Exposes CRUD operations for the **ProcessDeferredAccounting** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ProcessDeferredAccountings
      * const processDeferredAccountings = await prisma.processDeferredAccounting.findMany()
      * ```
      */
    get processDeferredAccounting(): Prisma.ProcessDeferredAccountingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.purchaseInvoiceTax`: Exposes CRUD operations for the **PurchaseInvoiceTax** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PurchaseInvoiceTaxes
      * const purchaseInvoiceTaxes = await prisma.purchaseInvoiceTax.findMany()
      * ```
      */
    get purchaseInvoiceTax(): Prisma.PurchaseInvoiceTaxDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.purchaseInvoiceAdvance`: Exposes CRUD operations for the **PurchaseInvoiceAdvance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PurchaseInvoiceAdvances
      * const purchaseInvoiceAdvances = await prisma.purchaseInvoiceAdvance.findMany()
      * ```
      */
    get purchaseInvoiceAdvance(): Prisma.PurchaseInvoiceAdvanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.drugStandard`: Exposes CRUD operations for the **DrugStandard** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DrugStandards
      * const drugStandards = await prisma.drugStandard.findMany()
      * ```
      */
    get drugStandard(): Prisma.DrugStandardDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.drugCatalogProduct`: Exposes CRUD operations for the **DrugCatalogProduct** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DrugCatalogProducts
      * const drugCatalogProducts = await prisma.drugCatalogProduct.findMany()
      * ```
      */
    get drugCatalogProduct(): Prisma.DrugCatalogProductDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.drugCatalogProductSpecies`: Exposes CRUD operations for the **DrugCatalogProductSpecies** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DrugCatalogProductSpecies
      * const drugCatalogProductSpecies = await prisma.drugCatalogProductSpecies.findMany()
      * ```
      */
    get drugCatalogProductSpecies(): Prisma.DrugCatalogProductSpeciesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicDrugStandard`: Exposes CRUD operations for the **ClinicDrugStandard** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicDrugStandards
      * const clinicDrugStandards = await prisma.clinicDrugStandard.findMany()
      * ```
      */
    get clinicDrugStandard(): Prisma.ClinicDrugStandardDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.drugMonograph`: Exposes CRUD operations for the **DrugMonograph** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DrugMonographs
      * const drugMonographs = await prisma.drugMonograph.findMany()
      * ```
      */
    get drugMonograph(): Prisma.DrugMonographDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.drugMonographDose`: Exposes CRUD operations for the **DrugMonographDose** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DrugMonographDoses
      * const drugMonographDoses = await prisma.drugMonographDose.findMany()
      * ```
      */
    get drugMonographDose(): Prisma.DrugMonographDoseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.therapeuticClass`: Exposes CRUD operations for the **TherapeuticClass** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TherapeuticClasses
      * const therapeuticClasses = await prisma.therapeuticClass.findMany()
      * ```
      */
    get therapeuticClass(): Prisma.TherapeuticClassDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.paymentEntry`: Exposes CRUD operations for the **PaymentEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PaymentEntries
      * const paymentEntries = await prisma.paymentEntry.findMany()
      * ```
      */
    get paymentEntry(): Prisma.PaymentEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.exchangeRateRevaluation`: Exposes CRUD operations for the **ExchangeRateRevaluation** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ExchangeRateRevaluations
      * const exchangeRateRevaluations = await prisma.exchangeRateRevaluation.findMany()
      * ```
      */
    get exchangeRateRevaluation(): Prisma.ExchangeRateRevaluationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.exchangeRateRevaluationAccount`: Exposes CRUD operations for the **ExchangeRateRevaluationAccount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ExchangeRateRevaluationAccounts
      * const exchangeRateRevaluationAccounts = await prisma.exchangeRateRevaluationAccount.findMany()
      * ```
      */
    get exchangeRateRevaluationAccount(): Prisma.ExchangeRateRevaluationAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.paymentEntryReference`: Exposes CRUD operations for the **PaymentEntryReference** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PaymentEntryReferences
      * const paymentEntryReferences = await prisma.paymentEntryReference.findMany()
      * ```
      */
    get paymentEntryReference(): Prisma.PaymentEntryReferenceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.paymentEntryDeduction`: Exposes CRUD operations for the **PaymentEntryDeduction** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PaymentEntryDeductions
      * const paymentEntryDeductions = await prisma.paymentEntryDeduction.findMany()
      * ```
      */
    get paymentEntryDeduction(): Prisma.PaymentEntryDeductionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.unreconcilePayment`: Exposes CRUD operations for the **UnreconcilePayment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more UnreconcilePayments
      * const unreconcilePayments = await prisma.unreconcilePayment.findMany()
      * ```
      */
    get unreconcilePayment(): Prisma.UnreconcilePaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.unreconcilePaymentEntry`: Exposes CRUD operations for the **UnreconcilePaymentEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more UnreconcilePaymentEntries
      * const unreconcilePaymentEntries = await prisma.unreconcilePaymentEntry.findMany()
      * ```
      */
    get unreconcilePaymentEntry(): Prisma.UnreconcilePaymentEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.antigen`: Exposes CRUD operations for the **Antigen** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Antigens
      * const antigens = await prisma.antigen.findMany()
      * ```
      */
    get antigen(): Prisma.AntigenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.vaccine`: Exposes CRUD operations for the **Vaccine** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Vaccines
      * const vaccines = await prisma.vaccine.findMany()
      * ```
      */
    get vaccine(): Prisma.VaccineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.vaccineAntigen`: Exposes CRUD operations for the **VaccineAntigen** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more VaccineAntigens
      * const vaccineAntigens = await prisma.vaccineAntigen.findMany()
      * ```
      */
    get vaccineAntigen(): Prisma.VaccineAntigenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.vaccineSpecies`: Exposes CRUD operations for the **VaccineSpecies** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more VaccineSpecies
      * const vaccineSpecies = await prisma.vaccineSpecies.findMany()
      * ```
      */
    get vaccineSpecies(): Prisma.VaccineSpeciesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.vaccinationProtocol`: Exposes CRUD operations for the **VaccinationProtocol** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more VaccinationProtocols
      * const vaccinationProtocols = await prisma.vaccinationProtocol.findMany()
      * ```
      */
    get vaccinationProtocol(): Prisma.VaccinationProtocolDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.vaccinationProtocolDose`: Exposes CRUD operations for the **VaccinationProtocolDose** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more VaccinationProtocolDoses
      * const vaccinationProtocolDoses = await prisma.vaccinationProtocolDose.findMany()
      * ```
      */
    get vaccinationProtocolDose(): Prisma.VaccinationProtocolDoseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.vaccinationRecord`: Exposes CRUD operations for the **VaccinationRecord** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more VaccinationRecords
      * const vaccinationRecords = await prisma.vaccinationRecord.findMany()
      * ```
      */
    get vaccinationRecord(): Prisma.VaccinationRecordDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileUnit`: Exposes CRUD operations for the **MobileUnit** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileUnits
      * const mobileUnits = await prisma.mobileUnit.findMany()
      * ```
      */
    get mobileUnit(): Prisma.MobileUnitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileUnitCrew`: Exposes CRUD operations for the **MobileUnitCrew** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileUnitCrews
      * const mobileUnitCrews = await prisma.mobileUnitCrew.findMany()
      * ```
      */
    get mobileUnitCrew(): Prisma.MobileUnitCrewDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileUnitActivity`: Exposes CRUD operations for the **MobileUnitActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileUnitActivities
      * const mobileUnitActivities = await prisma.mobileUnitActivity.findMany()
      * ```
      */
    get mobileUnitActivity(): Prisma.MobileUnitActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileUnitDevice`: Exposes CRUD operations for the **MobileUnitDevice** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileUnitDevices
      * const mobileUnitDevices = await prisma.mobileUnitDevice.findMany()
      * ```
      */
    get mobileUnitDevice(): Prisma.MobileUnitDeviceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileUnitShift`: Exposes CRUD operations for the **MobileUnitShift** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileUnitShifts
      * const mobileUnitShifts = await prisma.mobileUnitShift.findMany()
      * ```
      */
    get mobileUnitShift(): Prisma.MobileUnitShiftDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileUnitLocation`: Exposes CRUD operations for the **MobileUnitLocation** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileUnitLocations
      * const mobileUnitLocations = await prisma.mobileUnitLocation.findMany()
      * ```
      */
    get mobileUnitLocation(): Prisma.MobileUnitLocationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.serviceAddress`: Exposes CRUD operations for the **ServiceAddress** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ServiceAddresses
      * const serviceAddresses = await prisma.serviceAddress.findMany()
      * ```
      */
    get serviceAddress(): Prisma.ServiceAddressDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileVisit`: Exposes CRUD operations for the **MobileVisit** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileVisits
      * const mobileVisits = await prisma.mobileVisit.findMany()
      * ```
      */
    get mobileVisit(): Prisma.MobileVisitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileServiceCatalog`: Exposes CRUD operations for the **MobileServiceCatalog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileServiceCatalogs
      * const mobileServiceCatalogs = await prisma.mobileServiceCatalog.findMany()
      * ```
      */
    get mobileServiceCatalog(): Prisma.MobileServiceCatalogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileUnitService`: Exposes CRUD operations for the **MobileUnitService** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileUnitServices
      * const mobileUnitServices = await prisma.mobileUnitService.findMany()
      * ```
      */
    get mobileUnitService(): Prisma.MobileUnitServiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileVisitService`: Exposes CRUD operations for the **MobileVisitService** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileVisitServices
      * const mobileVisitServices = await prisma.mobileVisitService.findMany()
      * ```
      */
    get mobileVisitService(): Prisma.MobileVisitServiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.mobileBookingRequest`: Exposes CRUD operations for the **MobileBookingRequest** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MobileBookingRequests
      * const mobileBookingRequests = await prisma.mobileBookingRequest.findMany()
      * ```
      */
    get mobileBookingRequest(): Prisma.MobileBookingRequestDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.serviceZone`: Exposes CRUD operations for the **ServiceZone** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ServiceZones
      * const serviceZones = await prisma.serviceZone.findMany()
      * ```
      */
    get serviceZone(): Prisma.ServiceZoneDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.adapterPosting`: Exposes CRUD operations for the **AdapterPosting** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AdapterPostings
      * const adapterPostings = await prisma.adapterPosting.findMany()
      * ```
      */
    get adapterPosting(): Prisma.AdapterPostingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.insurer`: Exposes CRUD operations for the **Insurer** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Insurers
      * const insurers = await prisma.insurer.findMany()
      * ```
      */
    get insurer(): Prisma.InsurerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.insuranceProduct`: Exposes CRUD operations for the **InsuranceProduct** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InsuranceProducts
      * const insuranceProducts = await prisma.insuranceProduct.findMany()
      * ```
      */
    get insuranceProduct(): Prisma.InsuranceProductDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.insuranceProductCoverage`: Exposes CRUD operations for the **InsuranceProductCoverage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InsuranceProductCoverages
      * const insuranceProductCoverages = await prisma.insuranceProductCoverage.findMany()
      * ```
      */
    get insuranceProductCoverage(): Prisma.InsuranceProductCoverageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.patientPolicy`: Exposes CRUD operations for the **PatientPolicy** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PatientPolicies
      * const patientPolicies = await prisma.patientPolicy.findMany()
      * ```
      */
    get patientPolicy(): Prisma.PatientPolicyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.insuranceClaim`: Exposes CRUD operations for the **InsuranceClaim** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InsuranceClaims
      * const insuranceClaims = await prisma.insuranceClaim.findMany()
      * ```
      */
    get insuranceClaim(): Prisma.InsuranceClaimDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.insuranceClaimLine`: Exposes CRUD operations for the **InsuranceClaimLine** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InsuranceClaimLines
      * const insuranceClaimLines = await prisma.insuranceClaimLine.findMany()
      * ```
      */
    get insuranceClaimLine(): Prisma.InsuranceClaimLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingServiceDefinition`: Exposes CRUD operations for the **GroomingServiceDefinition** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingServiceDefinitions
      * const groomingServiceDefinitions = await prisma.groomingServiceDefinition.findMany()
      * ```
      */
    get groomingServiceDefinition(): Prisma.GroomingServiceDefinitionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingPriceRule`: Exposes CRUD operations for the **GroomingPriceRule** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingPriceRules
      * const groomingPriceRules = await prisma.groomingPriceRule.findMany()
      * ```
      */
    get groomingPriceRule(): Prisma.GroomingPriceRuleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingModifier`: Exposes CRUD operations for the **GroomingModifier** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingModifiers
      * const groomingModifiers = await prisma.groomingModifier.findMany()
      * ```
      */
    get groomingModifier(): Prisma.GroomingModifierDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingCapacityConfig`: Exposes CRUD operations for the **GroomingCapacityConfig** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingCapacityConfigs
      * const groomingCapacityConfigs = await prisma.groomingCapacityConfig.findMany()
      * ```
      */
    get groomingCapacityConfig(): Prisma.GroomingCapacityConfigDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.dietFood`: Exposes CRUD operations for the **DietFood** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DietFoods
      * const dietFoods = await prisma.dietFood.findMany()
      * ```
      */
    get dietFood(): Prisma.DietFoodDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.nutritionPlan`: Exposes CRUD operations for the **NutritionPlan** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more NutritionPlans
      * const nutritionPlans = await prisma.nutritionPlan.findMany()
      * ```
      */
    get nutritionPlan(): Prisma.NutritionPlanDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.nutritionPlanItem`: Exposes CRUD operations for the **NutritionPlanItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more NutritionPlanItems
      * const nutritionPlanItems = await prisma.nutritionPlanItem.findMany()
      * ```
      */
    get nutritionPlanItem(): Prisma.NutritionPlanItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.nutritionRecheck`: Exposes CRUD operations for the **NutritionRecheck** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more NutritionRechecks
      * const nutritionRechecks = await prisma.nutritionRecheck.findMany()
      * ```
      */
    get nutritionRecheck(): Prisma.NutritionRecheckDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.patientGroomingProfile`: Exposes CRUD operations for the **PatientGroomingProfile** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PatientGroomingProfiles
      * const patientGroomingProfiles = await prisma.patientGroomingProfile.findMany()
      * ```
      */
    get patientGroomingProfile(): Prisma.PatientGroomingProfileDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingSession`: Exposes CRUD operations for the **GroomingSession** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingSessions
      * const groomingSessions = await prisma.groomingSession.findMany()
      * ```
      */
    get groomingSession(): Prisma.GroomingSessionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingSessionItem`: Exposes CRUD operations for the **GroomingSessionItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingSessionItems
      * const groomingSessionItems = await prisma.groomingSessionItem.findMany()
      * ```
      */
    get groomingSessionItem(): Prisma.GroomingSessionItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingSessionAdjustment`: Exposes CRUD operations for the **GroomingSessionAdjustment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingSessionAdjustments
      * const groomingSessionAdjustments = await prisma.groomingSessionAdjustment.findMany()
      * ```
      */
    get groomingSessionAdjustment(): Prisma.GroomingSessionAdjustmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingIntake`: Exposes CRUD operations for the **GroomingIntake** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingIntakes
      * const groomingIntakes = await prisma.groomingIntake.findMany()
      * ```
      */
    get groomingIntake(): Prisma.GroomingIntakeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingPhoto`: Exposes CRUD operations for the **GroomingPhoto** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingPhotos
      * const groomingPhotos = await prisma.groomingPhoto.findMany()
      * ```
      */
    get groomingPhoto(): Prisma.GroomingPhotoDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingProduct`: Exposes CRUD operations for the **GroomingProduct** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingProducts
      * const groomingProducts = await prisma.groomingProduct.findMany()
      * ```
      */
    get groomingProduct(): Prisma.GroomingProductDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingIncident`: Exposes CRUD operations for the **GroomingIncident** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingIncidents
      * const groomingIncidents = await prisma.groomingIncident.findMany()
      * ```
      */
    get groomingIncident(): Prisma.GroomingIncidentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingFinding`: Exposes CRUD operations for the **GroomingFinding** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingFindings
      * const groomingFindings = await prisma.groomingFinding.findMany()
      * ```
      */
    get groomingFinding(): Prisma.GroomingFindingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingReportCard`: Exposes CRUD operations for the **GroomingReportCard** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingReportCards
      * const groomingReportCards = await prisma.groomingReportCard.findMany()
      * ```
      */
    get groomingReportCard(): Prisma.GroomingReportCardDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.groomingActivity`: Exposes CRUD operations for the **GroomingActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more GroomingActivities
      * const groomingActivities = await prisma.groomingActivity.findMany()
      * ```
      */
    get groomingActivity(): Prisma.GroomingActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.adCampaign`: Exposes CRUD operations for the **AdCampaign** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AdCampaigns
      * const adCampaigns = await prisma.adCampaign.findMany()
      * ```
      */
    get adCampaign(): Prisma.AdCampaignDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.adCreative`: Exposes CRUD operations for the **AdCreative** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AdCreatives
      * const adCreatives = await prisma.adCreative.findMany()
      * ```
      */
    get adCreative(): Prisma.AdCreativeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.adAudience`: Exposes CRUD operations for the **AdAudience** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AdAudiences
      * const adAudiences = await prisma.adAudience.findMany()
      * ```
      */
    get adAudience(): Prisma.AdAudienceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.adCampaignMetric`: Exposes CRUD operations for the **AdCampaignMetric** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AdCampaignMetrics
      * const adCampaignMetrics = await prisma.adCampaignMetric.findMany()
      * ```
      */
    get adCampaignMetric(): Prisma.AdCampaignMetricDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.marketingSocialAccount`: Exposes CRUD operations for the **MarketingSocialAccount** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MarketingSocialAccounts
      * const marketingSocialAccounts = await prisma.marketingSocialAccount.findMany()
      * ```
      */
    get marketingSocialAccount(): Prisma.MarketingSocialAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.adCopyTemplate`: Exposes CRUD operations for the **AdCopyTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AdCopyTemplates
      * const adCopyTemplates = await prisma.adCopyTemplate.findMany()
      * ```
      */
    get adCopyTemplate(): Prisma.AdCopyTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.membershipPlan`: Exposes CRUD operations for the **MembershipPlan** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MembershipPlans
      * const membershipPlans = await prisma.membershipPlan.findMany()
      * ```
      */
    get membershipPlan(): Prisma.MembershipPlanDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.membershipPlanBenefit`: Exposes CRUD operations for the **MembershipPlanBenefit** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MembershipPlanBenefits
      * const membershipPlanBenefits = await prisma.membershipPlanBenefit.findMany()
      * ```
      */
    get membershipPlanBenefit(): Prisma.MembershipPlanBenefitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.membership`: Exposes CRUD operations for the **Membership** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Memberships
      * const memberships = await prisma.membership.findMany()
      * ```
      */
    get membership(): Prisma.MembershipDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.membershipBenefit`: Exposes CRUD operations for the **MembershipBenefit** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MembershipBenefits
      * const membershipBenefits = await prisma.membershipBenefit.findMany()
      * ```
      */
    get membershipBenefit(): Prisma.MembershipBenefitDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.membershipEntitlement`: Exposes CRUD operations for the **MembershipEntitlement** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more MembershipEntitlements
      * const membershipEntitlements = await prisma.membershipEntitlement.findMany()
      * ```
      */
    get membershipEntitlement(): Prisma.MembershipEntitlementDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.invoiceMembershipAdjustment`: Exposes CRUD operations for the **InvoiceMembershipAdjustment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InvoiceMembershipAdjustments
      * const invoiceMembershipAdjustments = await prisma.invoiceMembershipAdjustment.findMany()
      * ```
      */
    get invoiceMembershipAdjustment(): Prisma.InvoiceMembershipAdjustmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.saleMembershipAdjustment`: Exposes CRUD operations for the **SaleMembershipAdjustment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SaleMembershipAdjustments
      * const saleMembershipAdjustments = await prisma.saleMembershipAdjustment.findMany()
      * ```
      */
    get saleMembershipAdjustment(): Prisma.SaleMembershipAdjustmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicCrmSettings`: Exposes CRUD operations for the **ClinicCrmSettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicCrmSettings
      * const clinicCrmSettings = await prisma.clinicCrmSettings.findMany()
      * ```
      */
    get clinicCrmSettings(): Prisma.ClinicCrmSettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmLeadStatus`: Exposes CRUD operations for the **CrmLeadStatus** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmLeadStatuses
      * const crmLeadStatuses = await prisma.crmLeadStatus.findMany()
      * ```
      */
    get crmLeadStatus(): Prisma.CrmLeadStatusDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmDealStatus`: Exposes CRUD operations for the **CrmDealStatus** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmDealStatuses
      * const crmDealStatuses = await prisma.crmDealStatus.findMany()
      * ```
      */
    get crmDealStatus(): Prisma.CrmDealStatusDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmLeadSource`: Exposes CRUD operations for the **CrmLeadSource** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmLeadSources
      * const crmLeadSources = await prisma.crmLeadSource.findMany()
      * ```
      */
    get crmLeadSource(): Prisma.CrmLeadSourceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmLostReason`: Exposes CRUD operations for the **CrmLostReason** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmLostReasons
      * const crmLostReasons = await prisma.crmLostReason.findMany()
      * ```
      */
    get crmLostReason(): Prisma.CrmLostReasonDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmIndustry`: Exposes CRUD operations for the **CrmIndustry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmIndustries
      * const crmIndustries = await prisma.crmIndustry.findMany()
      * ```
      */
    get crmIndustry(): Prisma.CrmIndustryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmLead`: Exposes CRUD operations for the **CrmLead** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmLeads
      * const crmLeads = await prisma.crmLead.findMany()
      * ```
      */
    get crmLead(): Prisma.CrmLeadDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmStatusChangeLog`: Exposes CRUD operations for the **CrmStatusChangeLog** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmStatusChangeLogs
      * const crmStatusChangeLogs = await prisma.crmStatusChangeLog.findMany()
      * ```
      */
    get crmStatusChangeLog(): Prisma.CrmStatusChangeLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmSlaPolicy`: Exposes CRUD operations for the **CrmSlaPolicy** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmSlaPolicies
      * const crmSlaPolicies = await prisma.crmSlaPolicy.findMany()
      * ```
      */
    get crmSlaPolicy(): Prisma.CrmSlaPolicyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmSlaPolicySource`: Exposes CRUD operations for the **CrmSlaPolicySource** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmSlaPolicySources
      * const crmSlaPolicySources = await prisma.crmSlaPolicySource.findMany()
      * ```
      */
    get crmSlaPolicySource(): Prisma.CrmSlaPolicySourceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmSavedView`: Exposes CRUD operations for the **CrmSavedView** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmSavedViews
      * const crmSavedViews = await prisma.crmSavedView.findMany()
      * ```
      */
    get crmSavedView(): Prisma.CrmSavedViewDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmDeal`: Exposes CRUD operations for the **CrmDeal** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmDeals
      * const crmDeals = await prisma.crmDeal.findMany()
      * ```
      */
    get crmDeal(): Prisma.CrmDealDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmDealProduct`: Exposes CRUD operations for the **CrmDealProduct** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmDealProducts
      * const crmDealProducts = await prisma.crmDealProduct.findMany()
      * ```
      */
    get crmDealProduct(): Prisma.CrmDealProductDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmEmailTemplate`: Exposes CRUD operations for the **CrmEmailTemplate** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmEmailTemplates
      * const crmEmailTemplates = await prisma.crmEmailTemplate.findMany()
      * ```
      */
    get crmEmailTemplate(): Prisma.CrmEmailTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmEmailMessage`: Exposes CRUD operations for the **CrmEmailMessage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmEmailMessages
      * const crmEmailMessages = await prisma.crmEmailMessage.findMany()
      * ```
      */
    get crmEmailMessage(): Prisma.CrmEmailMessageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmWhatsappMessage`: Exposes CRUD operations for the **CrmWhatsappMessage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmWhatsappMessages
      * const crmWhatsappMessages = await prisma.crmWhatsappMessage.findMany()
      * ```
      */
    get crmWhatsappMessage(): Prisma.CrmWhatsappMessageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmNote`: Exposes CRUD operations for the **CrmNote** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmNotes
      * const crmNotes = await prisma.crmNote.findMany()
      * ```
      */
    get crmNote(): Prisma.CrmNoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmTask`: Exposes CRUD operations for the **CrmTask** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmTasks
      * const crmTasks = await prisma.crmTask.findMany()
      * ```
      */
    get crmTask(): Prisma.CrmTaskDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.crmComment`: Exposes CRUD operations for the **CrmComment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CrmComments
      * const crmComments = await prisma.crmComment.findMany()
      * ```
      */
    get crmComment(): Prisma.CrmCommentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicPharmacySettings`: Exposes CRUD operations for the **ClinicPharmacySettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicPharmacySettings
      * const clinicPharmacySettings = await prisma.clinicPharmacySettings.findMany()
      * ```
      */
    get clinicPharmacySettings(): Prisma.ClinicPharmacySettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.prescription`: Exposes CRUD operations for the **Prescription** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Prescriptions
      * const prescriptions = await prisma.prescription.findMany()
      * ```
      */
    get prescription(): Prisma.PrescriptionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.prescriptionItem`: Exposes CRUD operations for the **PrescriptionItem** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PrescriptionItems
      * const prescriptionItems = await prisma.prescriptionItem.findMany()
      * ```
      */
    get prescriptionItem(): Prisma.PrescriptionItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.dispenseEvent`: Exposes CRUD operations for the **DispenseEvent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more DispenseEvents
      * const dispenseEvents = await prisma.dispenseEvent.findMany()
      * ```
      */
    get dispenseEvent(): Prisma.DispenseEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.controlledSubstance`: Exposes CRUD operations for the **ControlledSubstance** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ControlledSubstances
      * const controlledSubstances = await prisma.controlledSubstance.findMany()
      * ```
      */
    get controlledSubstance(): Prisma.ControlledSubstanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.controlledDrugRegister`: Exposes CRUD operations for the **ControlledDrugRegister** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ControlledDrugRegisters
      * const controlledDrugRegisters = await prisma.controlledDrugRegister.findMany()
      * ```
      */
    get controlledDrugRegister(): Prisma.ControlledDrugRegisterDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.batchDisposal`: Exposes CRUD operations for the **BatchDisposal** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BatchDisposals
      * const batchDisposals = await prisma.batchDisposal.findMany()
      * ```
      */
    get batchDisposal(): Prisma.BatchDisposalDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.batchDisposalWitness`: Exposes CRUD operations for the **BatchDisposalWitness** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BatchDisposalWitnesses
      * const batchDisposalWitnesses = await prisma.batchDisposalWitness.findMany()
      * ```
      */
    get batchDisposalWitness(): Prisma.BatchDisposalWitnessDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.cage`: Exposes CRUD operations for the **Cage** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Cages
      * const cages = await prisma.cage.findMany()
      * ```
      */
    get cage(): Prisma.CageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.cageAssignment`: Exposes CRUD operations for the **CageAssignment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CageAssignments
      * const cageAssignments = await prisma.cageAssignment.findMany()
      * ```
      */
    get cageAssignment(): Prisma.CageAssignmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inpatientStay`: Exposes CRUD operations for the **InpatientStay** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InpatientStays
      * const inpatientStays = await prisma.inpatientStay.findMany()
      * ```
      */
    get inpatientStay(): Prisma.InpatientStayDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inpatientOrder`: Exposes CRUD operations for the **InpatientOrder** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InpatientOrders
      * const inpatientOrders = await prisma.inpatientOrder.findMany()
      * ```
      */
    get inpatientOrder(): Prisma.InpatientOrderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inpatientAdministration`: Exposes CRUD operations for the **InpatientAdministration** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InpatientAdministrations
      * const inpatientAdministrations = await prisma.inpatientAdministration.findMany()
      * ```
      */
    get inpatientAdministration(): Prisma.InpatientAdministrationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.inpatientActivity`: Exposes CRUD operations for the **InpatientActivity** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more InpatientActivities
      * const inpatientActivities = await prisma.inpatientActivity.findMany()
      * ```
      */
    get inpatientActivity(): Prisma.InpatientActivityDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.emergencyArrival`: Exposes CRUD operations for the **EmergencyArrival** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more EmergencyArrivals
      * const emergencyArrivals = await prisma.emergencyArrival.findMany()
      * ```
      */
    get emergencyArrival(): Prisma.EmergencyArrivalDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.triageAssessment`: Exposes CRUD operations for the **TriageAssessment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TriageAssessments
      * const triageAssessments = await prisma.triageAssessment.findMany()
      * ```
      */
    get triageAssessment(): Prisma.TriageAssessmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.patientAlert`: Exposes CRUD operations for the **PatientAlert** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PatientAlerts
      * const patientAlerts = await prisma.patientAlert.findMany()
      * ```
      */
    get patientAlert(): Prisma.PatientAlertDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.scheduledJob`: Exposes CRUD operations for the **ScheduledJob** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ScheduledJobs
      * const scheduledJobs = await prisma.scheduledJob.findMany()
      * ```
      */
    get scheduledJob(): Prisma.ScheduledJobDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.notificationOutbox`: Exposes CRUD operations for the **NotificationOutbox** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more NotificationOutboxes
      * const notificationOutboxes = await prisma.notificationOutbox.findMany()
      * ```
      */
    get notificationOutbox(): Prisma.NotificationOutboxDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.reminderRule`: Exposes CRUD operations for the **ReminderRule** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ReminderRules
      * const reminderRules = await prisma.reminderRule.findMany()
      * ```
      */
    get reminderRule(): Prisma.ReminderRuleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.recallContact`: Exposes CRUD operations for the **RecallContact** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RecallContacts
      * const recallContacts = await prisma.recallContact.findMany()
      * ```
      */
    get recallContact(): Prisma.RecallContactDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.clinicLoyaltySettings`: Exposes CRUD operations for the **ClinicLoyaltySettings** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ClinicLoyaltySettings
      * const clinicLoyaltySettings = await prisma.clinicLoyaltySettings.findMany()
      * ```
      */
    get clinicLoyaltySettings(): Prisma.ClinicLoyaltySettingsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.loyaltyProgram`: Exposes CRUD operations for the **LoyaltyProgram** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LoyaltyPrograms
      * const loyaltyPrograms = await prisma.loyaltyProgram.findMany()
      * ```
      */
    get loyaltyProgram(): Prisma.LoyaltyProgramDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.loyaltyTier`: Exposes CRUD operations for the **LoyaltyTier** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LoyaltyTiers
      * const loyaltyTiers = await prisma.loyaltyTier.findMany()
      * ```
      */
    get loyaltyTier(): Prisma.LoyaltyTierDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.loyaltyOwnerTier`: Exposes CRUD operations for the **LoyaltyOwnerTier** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LoyaltyOwnerTiers
      * const loyaltyOwnerTiers = await prisma.loyaltyOwnerTier.findMany()
      * ```
      */
    get loyaltyOwnerTier(): Prisma.LoyaltyOwnerTierDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.loyaltyLedgerEntry`: Exposes CRUD operations for the **LoyaltyLedgerEntry** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LoyaltyLedgerEntries
      * const loyaltyLedgerEntries = await prisma.loyaltyLedgerEntry.findMany()
      * ```
      */
    get loyaltyLedgerEntry(): Prisma.LoyaltyLedgerEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.loyaltyRedemption`: Exposes CRUD operations for the **LoyaltyRedemption** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LoyaltyRedemptions
      * const loyaltyRedemptions = await prisma.loyaltyRedemption.findMany()
      * ```
      */
    get loyaltyRedemption(): Prisma.LoyaltyRedemptionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.loyaltyRedemptionAllocation`: Exposes CRUD operations for the **LoyaltyRedemptionAllocation** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LoyaltyRedemptionAllocations
      * const loyaltyRedemptionAllocations = await prisma.loyaltyRedemptionAllocation.findMany()
      * ```
      */
    get loyaltyRedemptionAllocation(): Prisma.LoyaltyRedemptionAllocationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.registrationCampaign`: Exposes CRUD operations for the **RegistrationCampaign** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RegistrationCampaigns
      * const registrationCampaigns = await prisma.registrationCampaign.findMany()
      * ```
      */
    get registrationCampaign(): Prisma.RegistrationCampaignDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.registrationCollaborator`: Exposes CRUD operations for the **RegistrationCollaborator** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RegistrationCollaborators
      * const registrationCollaborators = await prisma.registrationCollaborator.findMany()
      * ```
      */
    get registrationCollaborator(): Prisma.RegistrationCollaboratorDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.registrationRequest`: Exposes CRUD operations for the **RegistrationRequest** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RegistrationRequests
      * const registrationRequests = await prisma.registrationRequest.findMany()
      * ```
      */
    get registrationRequest(): Prisma.RegistrationRequestDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.registrationDocument`: Exposes CRUD operations for the **RegistrationDocument** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RegistrationDocuments
      * const registrationDocuments = await prisma.registrationDocument.findMany()
      * ```
      */
    get registrationDocument(): Prisma.RegistrationDocumentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.patientDocument`: Exposes CRUD operations for the **PatientDocument** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PatientDocuments
      * const patientDocuments = await prisma.patientDocument.findMany()
      * ```
      */
    get patientDocument(): Prisma.PatientDocumentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.registrationComment`: Exposes CRUD operations for the **RegistrationComment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RegistrationComments
      * const registrationComments = await prisma.registrationComment.findMany()
      * ```
      */
    get registrationComment(): Prisma.RegistrationCommentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.registrationTimelineStep`: Exposes CRUD operations for the **RegistrationTimelineStep** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RegistrationTimelineSteps
      * const registrationTimelineSteps = await prisma.registrationTimelineStep.findMany()
      * ```
      */
    get registrationTimelineStep(): Prisma.RegistrationTimelineStepDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
