import type { ConversationKind } from "@/generated/prisma/enums";
import { type ChatDirectoryEntry, type ChatMessageRow, type ConversationListItem, type ConversationRow, type ConversationThread } from "@/server/chat/chat.type";
export declare const chatDao: {
    /**
     * دليل الفريق: مستخدمو الأكاديمية (عدا أنا) قابلين للمراسلة، يليهم موظفو
     * الأكاديمية الذين بلا حساب دخول (معطّلون في المنتقي حتى يُدعوا للنظام).
     */
    directory(clinicId: string, userId: string): Promise<ChatDirectoryEntry[]>;
    /** قائمة محادثاتي مرتبة بآخر نشاط، مع عدّاد غير المقروء لكل محادثة */
    listConversations(clinicId: string, userId: string): Promise<ConversationListItem[]>;
    /** مجرى المحادثة + أدنى «آخر قراءة» لبقية الأعضاء (لعلامتَي الصح) */
    getThread(conversationId: string, clinicId: string, userId: string): Promise<ConversationThread>;
    /**
     * إنشاء محادثة مع رسالتها الأولى. الفردية لا تتكرر: وجود محادثة فردية
     * سابقة مع نفس الطرف يعيد استخدامها ويرسل الرسالة فيها.
     */
    createConversation(clinicId: string, userId: string, input: {
        kind: ConversationKind;
        memberIds: string[];
        body: string;
    }): Promise<{
        conversation: ConversationRow;
        memberIds: string[];
        reused: boolean;
    }>;
    /** إرسال رسالة (نص و/أو مرفق): إنشاء + تحديث آخر نشاط + اعتبارها مقروءة عندي */
    sendMessage(conversationId: string, clinicId: string, userId: string, body: string, attachment?: {
        name: string;
        mime: string;
        size: number;
        data: Uint8Array<ArrayBuffer>;
    }): Promise<{
        message: ChatMessageRow;
        memberIds: string[];
    }>;
    /** تعليم المحادثة مقروءة حتى اللحظة */
    markRead(conversationId: string, clinicId: string, userId: string): Promise<{
        memberIds: string[];
    }>;
    /** تثبيت/كتم — خصائص عضويتي أنا فقط */
    updateMember(conversationId: string, clinicId: string, userId: string, data: {
        pinned?: boolean;
        muted?: boolean;
    }): Promise<{
        id: string;
        muted: boolean;
        pinned: boolean;
    }>;
    /** إضافة أعضاء لمحادثة جماعية */
    addMembers(conversationId: string, clinicId: string, userId: string, memberIds: string[]): Promise<{
        memberIds: string[];
    }>;
    /** جلب مرفق رسالة — بيانات الملف تُقرأ هنا فقط بعد التحقق من العضوية */
    getAttachment(messageId: string, clinicId: string, userId: string): Promise<{
        name: string;
        mime: string;
        data: Uint8Array<ArrayBuffer>;
    }>;
    /**
     * إشعار وارد للأعضاء غير المتصلين بمجرى الأحداث لحظة الإرسال — المتصلون
     * يرون التوست/العدّادات فورًا فلا نغرق واردهم. إشعار واحد غير مقروء لكل
     * (محادثة، مستلم): وجود واحد قائم يمنع التكرار. لا يرمي أبدًا حتى لا
     * يُفشل الإرسال نفسه.
     */
    emitChatNotifications(input: {
        clinicId: string;
        conversationId: string;
        authorUserId: string;
        authorName: string;
        preview: string;
        recipientUserIds: string[];
    }): Promise<void>;
    /** حذف المحادثة نهائيًا لجميع الأعضاء (الرسائل تُحذف تتاليًا) */
    deleteConversation(conversationId: string, clinicId: string, userId: string): Promise<{
        memberIds: string[];
    }>;
};
