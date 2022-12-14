import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { Ok, Err, Result } from 'ts-results'

let validDepartmentCodes: string[] = []

// determine if a code represents a department at Brown
async function isValidDepartment(code: string): Promise<boolean> {
  // load in department codes if they aren't loaded already
  if (validDepartmentCodes.length === 0) {
    const metaDoc = await getDoc(doc(db, 'departments', '_meta'))
    const codes: string[] | undefined = metaDoc.data()?.all_codes
    if (codes) {
      validDepartmentCodes = codes
    } else {
      console.error(
        `Departments' "_meta" doc either doesn't exist or doesn't have "all_codes" field.` +
          ` Run the backend "add-departments" script to fix.`
      )
    }
  }
  return validDepartmentCodes.includes(code)
}

/**
 * Determines if the specified string is a valid course number
 * with format "XXXX[L]" where X are digits and [L] is an optional letter
 * @param num the course number as a string
 * @returns true if `num` is a valid course number, false otherwise
 */
function isValidCourseNumber(num: string): boolean {
  const regex = /^\d{4}[A-Z]?$/
  return regex.test(num)
}

/**
 * Tries to add a new class to the firestore database,
 * initializing averages and total time to 0
 * @param department   the department code (Ex: CSCI)
 * @param courseNumber the course number (Ex: 0320)
 * @param name         the name of the course
 * @returns a result with the new class's id if it succeeds, or an error if it fails.
 * Reasons for failing include invalid args or the class already exists.
 */
export async function addNewClass(
  department: string,
  courseNumber: string,
  name: string
): Promise<Result<string, Error>> {
  department = department.toUpperCase().trim()
  courseNumber = courseNumber.toUpperCase().trim()
  name = name.trim()
  // check args are validly formatted
  if (!(await isValidDepartment(department))) {
    return Err(new Error(`"${department}" is not a valid department code`))
  } else if (!isValidCourseNumber(courseNumber)) {
    return Err(new Error(`"${courseNumber}" is not a valid course number`))
  } else {
    const newClassId = department + ' ' + courseNumber
    const newClassRef = doc(db, 'classes', newClassId)
    // check if class with the same id already exists
    const oldClass = await getDoc(newClassRef)
    if (oldClass.exists()) {
      return Err(new Error(`Class with id "${newClassId}" already exists`))
    }
    // create the new class doc in the global 'classes' collection
    await setDoc(newClassRef, {
      daily_average: '0',
      department: department,
      course_number: courseNumber,
      name: name,
      total_time: '0',
      weekly_average: '0',
    })
    return Ok(newClassId)
  }
}
