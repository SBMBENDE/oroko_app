export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CHAPTER_ADMIN = 'CHAPTER_ADMIN',
  EXECUTIVE = 'EXECUTIVE',
  MEMBER = 'MEMBER',
  PENDING_MEMBER = 'PENDING_MEMBER',
}

export enum MemberStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
  INACTIVE = 'Inactive',
  REJECTED = 'Rejected',
}

export enum NotificationType {
  MESSAGE = 'MESSAGE',
  APPROVAL = 'APPROVAL',
  REJECTION = 'REJECTION',
  SUSPENSION = 'SUSPENSION',
  ROLE_CHANGE = 'ROLE_CHANGE',
  SYSTEM = 'SYSTEM',
}

export enum AuditAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SUSPEND = 'SUSPEND',
  REINSTATE = 'REINSTATE',
  ASSIGN_ROLE = 'ASSIGN_ROLE',
  ASSIGN_CHAPTER = 'ASSIGN_CHAPTER',
  ASSIGN_EXECUTIVE = 'ASSIGN_EXECUTIVE',
  UPDATE_MEMBER = 'UPDATE_MEMBER',
  DELETE_MEMBER = 'DELETE_MEMBER',
  CREATE_MEMBER = 'CREATE_MEMBER',
}

// Role hierarchy — higher index = more privilege
export const ROLE_HIERARCHY: Role[] = [
  Role.PENDING_MEMBER,
  Role.MEMBER,
  Role.EXECUTIVE,
  Role.CHAPTER_ADMIN,
  Role.ADMIN,
  Role.SUPER_ADMIN,
];

/** Returns true if `userRole` has at least the privilege of `requiredRole` */
export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(requiredRole);
}
