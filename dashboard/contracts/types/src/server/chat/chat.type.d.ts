import type { Prisma } from "@/generated/prisma/client";
/** أعضاء المحادثة مع هوية المستخدم — يكفي للاسم والأفاتار وحالة كل عضو */
export declare const conversationMemberSelect: {
    readonly id: true;
    readonly userId: true;
    readonly pinned: true;
    readonly muted: true;
    readonly lastReadAt: true;
    readonly joinedAt: true;
    readonly user: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
/** صف محادثة في القائمة: الأعضاء + آخر رسالة (للمعاينة) */
export declare const conversationInclude: {
    readonly members: {
        readonly select: {
            readonly id: true;
            readonly userId: true;
            readonly pinned: true;
            readonly muted: true;
            readonly lastReadAt: true;
            readonly joinedAt: true;
            readonly user: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
    readonly messages: {
        readonly orderBy: {
            readonly createdAt: "desc";
        };
        readonly take: 1;
        readonly select: {
            readonly id: true;
            readonly body: true;
            readonly authorId: true;
            readonly createdAt: true;
            readonly attachmentName: true;
        };
    };
};
export type ConversationRow = Prisma.ConversationGetPayload<{
    include: typeof conversationInclude;
}>;
/** صف القائمة مع عدّاد غير المقروء المحسوب لكل مستخدم */
export type ConversationListItem = ConversationRow & {
    unreadCount: number;
};
export declare const chatMessageSelect: {
    readonly id: true;
    readonly conversationId: true;
    readonly authorId: true;
    readonly body: true;
    readonly attachmentName: true;
    readonly attachmentMime: true;
    readonly attachmentSize: true;
    readonly createdAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type ChatMessageRow = Prisma.ChatMessageGetPayload<{
    select: typeof chatMessageSelect;
}>;
/** مجرى محادثة: الرسائل + أدنى «آخر قراءة» لبقية الأعضاء (أساس علامتَي الصح) */
export type ConversationThread = {
    messages: ChatMessageRow[];
    peersLastReadAt: Date | null;
};
/**
 * عضو دليل الفريق. مصدره إما مستخدم أكاديمية (يمكن مراسلته) أو موظف بلا حساب
 * دخول (يظهر معطّلًا في المنتقي — لا يمكنه قراءة الرسائل حتى يُدعى ويرتبط بحساب).
 */
export type ChatDirectoryEntry = {
    /** userId لمن له حساب، وإلا معرّف الموظف (لا يُرسل للخادم أبدًا) */
    id: string;
    name: string;
    email: string;
    phone: string | null;
    /** المسمّى الوظيفي من ملف الموظف المرتبط، إن وُجد */
    title: string | null;
    /** المدينة/العنوان من ملف الموظف — لبطاقة بروفايل المحادثة */
    location: string | null;
    joinedAt: Date;
    online: boolean;
    /** false = موظف بلا حساب دخول — يُعرض معطّلًا ولا يُختار مستلمًا */
    hasAccount: boolean;
};
