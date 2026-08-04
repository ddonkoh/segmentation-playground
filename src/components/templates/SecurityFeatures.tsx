"use client";

/**
 * Security Features Section
 * Highlights the 7-layer security stack
 */
const SecurityFeatures = () => {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "HTTPS Enforcement",
      description: "All traffic encrypted by default. No exceptions.",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      badge: "Default",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "CSRF Protection",
      description: "Double-submit token protection on all mutations.",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      badge: "Built-in",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Rate Limiting",
      description: "IP-based rate limiting prevents abuse and attacks.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      badge: "Active",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Security Headers",
      description: "CSP, HSTS, and XSS protection headers configured.",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      badge: "Configured",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Auth Guards",
      description: "Middleware-based route protection for sensitive pages.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      badge: "Enabled",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "Audit Logging",
      description: "Complete security event logging for compliance.",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
      badge: "Compliant",
    },
  ];

  return (
    <section className="bg-base-100 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-medium text-primary mb-4">Security</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight mb-4">
            7-Layer Security Stack
          </h2>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Security isn't an afterthought. Every layer is built-in and enabled by default.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-base-200 p-6 rounded-lg border border-base-content/10 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                {feature.badge && (
                  <span className="badge badge-sm badge-primary badge-outline">
                    {feature.badge}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-base-content/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityFeatures;

